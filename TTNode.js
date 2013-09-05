/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-4
 * Time: 下午11:47
 * To change this template use File | Settings | File Templates.
 */

var cc = cc || {};

cc.DRAW_MODE_NOCACHE = 0;//无缓存模式
cc.DRAW_MODE_CACHE = 1;//缓存模式

cc.DIRTY_TYPE_NO = -1;//不受污染
cc.DIRTY_TYPE_CLEARNING = 0;//不受污染
cc.DIRTY_TYPE_POLLUTE = 1;//污染
cc.DIRTY_TYPE_SRC = 2;//源头

cc.DIRTY_STATE_NO = -1;//正常状态
cc.DIRTY_STATE_CLEANING = 0;//污染刚被清除
cc.DIRTY_STATE_ONCE = 1;//只污染一次
cc.DIRTY_STATE_LONG = 2;//持续污染
cc.DIRTY_STATE_HAND = 3;//手动污染

cc.Node = cc.Class.extend({
    _drawMode : null,//绘图模式
    _isRecache : true,
    _isCacheNode : false,
    _dirtyState : null,
    _dirtyType : null,
    _cacheCanvas : null,
    _cacheContext : null,
    _img : null,
    _isNeedToClear : false,

    setDirty : function(dirtyType, dirtyState){
        if(dirtyType == cc.DIRTY_TYPE_SRC) {//只有污染源才会有污染状态
            dirtyState = dirtyState || cc.DIRTY_STATE_ONCE;//默认为一次性污染
            if(this._dirtyState == null || dirtyState > this._dirtyState) this._dirtyState = drityState;
        }
        if(this._dirtyType != null && this._dirtyType >= dirtyType) return;//已经设置过了，直接返回
        this._isRecache = true;
        this._dirtyType = dirtyType;
        var parent = this.getParent();
        if(parent) parent.setDirty(cc.DIRTY_TYPE_POLLUTE);
    },

    clearDirty : function(){
        var children = this._children;
        var l = children.length, i, isCleared = true;
        for(i = 0; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            var dirtyType = child.getDirtyType();
            if(dirtyType == cc.DIRTY_TYPE_POLLUTE || dirtyType == cc.DIRTY_TYPE_SRC){
                isCleared = false;
                break;
            }
        }
        if(isCleared){
            this._dirtyType = cc.DIRTY_TYPE_NO;
            this._dirtyState = cc.DIRTY_STATE_CLEANING;
            this.setToClear();
        }else{//如果是污染源这变成感染者
            this._dirtyType = cc.DIRTY_TYPE_POLLUTE;
            this._dirtyState = cc.DIRTY_STATE_CLEANING;
        }

    },


    setDrawMode : function(mode){
        this._drawMode = mode;
        var l = this._children;
        for(var i = 0; i < l; ++i){
            var child = this._children[i];
            if(child) child.setDrawMode(mode);
        }
    },
    setIsCacheNode : function(b){
        this._isCacheNode = b;
        if(b == true) this.setDrawMode(cc.DRAW_MODE_CACHE);
    },
    isCacheNode : function(){
        return this._isCacheNode || false;
    },
    getDirtyType : function(){
        return this._dirtyType;
    },
    getDirtyState : function(){
        return this._dirtyState;
    },
    setToClear : function(b){
        this._isNeedToClear = b;
        var parent = this.getParent();
        if(parent){
            if(parent.isCacheNode()) return;
            parent.setToClear();
        }
    },
    isNeedToClear : function(){
        return this._isNeedToClear || false;
    },

    _initImg : function(cxt, b, t){
        cxt.clearRect(0, 0, cxt.width, -cxt.height);
        cxt.save();
        cxt.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
        if (b) {
            var l = b.length;
            for (var i = 0; i < l; i++) {
                b[i].visit(cxt);
            }
        }
        this.draw(cxt);
        if (t) {
            var l = t.length;
            for (var i = 0; i < l; i++) {
                t[i].visit(cxt);
            }
        }
        var data = cxt.toDataURL("png");
        cxt.restore();
        return data;
    },

    _append2Img : function(cxt, img, arr){
        cxt.clearRect(0, 0, cxt.width, -cxt.height);
        cxt.save();
        cxt.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
        cxt.drawImage(img, 0, 0);
        if (arr) {
            var l = arr.length;
            for (var i = 0; i < l; i++) {
                arr[i].visit(cxt);
            }
        }
        var data = cxt.toDataURL("png");
        cxt.restore();
        return data;
    },

    _visit4Cache : function(ctx){
        this.sortAllChildren();
        if(this._img && this._dirtyState != cc.DIRTY_TYPE_POLLUTE && this._dirtyState != cc.DIRTY_TYPE_SRC){
            //TODO 如果自身不受污染，则只会画这步
            ctx.drawImage(this._img, 0, 0);//TODO 画图
            return;
        }

        //TODO 需要考虑层级关系
        //TODO 先对children进行排序
        //TODO 找出children中dirtyArr以及appendArr

        var children = this._children, bottomArr = [], topArr = [], appendArr = [], dirtyArr = [], i, l;
        for(i = 0, l = children.length; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            var dirtyType = child.getDirtyType();
            if(child.isNeedToClear()){
                appendArr.push(child);
            }
            if(dirtyType == cc.DIRTY_TYPE_SRC || dirtyType == cc.DIRTY_TYPE_POLLUTE){
                dirtyArr.push(child);
            }
            if(dirtyType != cc.DIRTY_TYPE_SRC){
                if(child.getTag() > 0) bottomArr.push(child);
                else topArr.push(child);
            }
        }

        if(this._isRecache){//TODO 第一次也要redraw，进行初始化
            //TODO 目前先做只有上层dirty的情况
            //TODO 先将相对于当前节点不动层画作一个img
            this._img = this._img || document.createElement("img");
            if(!this._cacheCanvas){
                this._cacheCanvas = document.createElement('canvas');
                this._cacheContext = this._cacheCanvas.getContext('2d');
                var winSize = cc.Director.getInstance().getWinSize();
                this._cacheCanvas.width = winSize.width;
                this._cacheCanvas.height = winSize.height;
                this._cacheContext.isCache = true;
            }
            this._img.src = this._initImg(this._cacheContext, bottomArr, topArr);
            this._isRecache = false;
        }
        //TODO 如果是cache模式，则只画不懂部分
        if(ctx.isCache && this._dirtyType != cc.DIRTY_TYPE_SRC){//并且自身不为污染源
            //TODO 处理停止污染的污染者
            if(appendArr.length > 0){
                //TODO 追加到img中
            }
            //TODO 如果自身不受污染，则只会画这步
            ctx.drawImage(this._img, 0, 0);//TODO 画图
        }else if(!ctx.isCache){
            //TODO 处理污染者
            if(this._dirtyType == cc.DIRTY_TYPE_SRC) ctx.drawImage(this._img, 0, 0);//TODO 画图
            for(i = 0, l = dirtyArr.length; i < l; ++i){
                var child = dirtyArr[i];
                if(!child) continue;
                child.visit(ctx);
            }
        }

    }
});