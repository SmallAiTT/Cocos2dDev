/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-4
 * Time: 下午11:47
 * To change this template use File | Settings | File Templates.
 */


cc.DRAW_MODE_CACHE = 1;//缓存模式

cc.DIRTY_STATE_SRC = 1;//源头
cc.DIRTY_STATE_POLLUTE = 2;//污染

cc.Node = cc.Class.extend({
    _drawMode : null,//绘图模式
    _isRedraw : true,
    _isCacheNode : false,
    _dirtyState : null,
    _bottomImg : null,
    _topImg : null,
    _sumImg : null,

    _cacheCanvas : null,
    _cacheContext : null,


    _img : null,


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
    },
    setDirtyState : function(state){
        this._dirtyState = state;
        if(!this._isCacheNode
            && (state == cc.DIRTY_STATE_SRC || state == cc.DIRTY_STATE_POLLUTE)
            && this.getParent() != null){
            this.getParent().setDirtyState(cc.DIRTY_STATE_POLLUTE);
        }
    },
    setIsRedraw : function(b){
        this._isRedraw = b;
        var l = this._children;
        for(var i = 0; i < l; ++i){
            var child = this._children[i];
            if(child) child.setIsRedraw(b);
        }
    },
    initImg : function(cxt, b, t){
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

    append2Img : function(cxt, img, arr){
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

    visit4Cache : function(ctx){

        ctx.save();
        this.transform(ctx);

        if(this._img && this._dirtyState != cc.DIRTY_STATE_POLLUTE && this._dirtyState != cc.DIRTY_STATE_SRC){
            //TODO 如果自身不受污染，则只会画这步
            ctx.drawImage(this._img, 0, 0);//TODO 画图
            ctx.restore();
            return;
        }

        //TODO 需要考虑层级关系
        //TODO 先对children进行排序
        //TODO 找出children中dirtyArr
        //TODO dirtyArr分为bottomDirtyArr以及topDirtyArr

        var bottomArr = [], topArr = [], bottomAppendArr = [], topAppendArr = [], bottomDirtyArr = [], topDirtyArr = [];

        if(this._isRedraw){//TODO 第一次也要redraw，进行初始化
            //TODO 遍历bottomArr  非dirtySrc   ===>bottomImg || null
            //TODO 画自身
            //TODO 遍历topArr  非dirtySrc   ====>topImg || null

            //TODO 目前先做只有上层dirty的情况
            //TODO 先将不动层画作一个img
            this._img = this._img || document.createElement("img");
            this._img.src = this.initImg(this._cacheContext, bottomArr, topArr);
            this._isRedraw = false;
        }

        //TODO 处理污染者停止污染
        if(bottomAppendArr.length > 0){ //TODO 底部需要追加
            //TODO 追加到bottomImg中
        }
        if(topAppendArr.length > 0){
            //TODO 追加到topImg中
            this._img.src = this.append2Img(this._cacheContext, this._img, topAppendArr);
        }

        //TODO 如果自身不受污染，则只会画这步
        ctx.drawImage(this._img, 0, 0);//TODO 画图

        //TODO 处理污染者
        if(topDirtyArr.length > 0){
            //TODO 追加到topImg中
            this._img.src = this.append2Img(ctx, this._img, topDirtyArr);
        }
        ctx.restore();
    }
});