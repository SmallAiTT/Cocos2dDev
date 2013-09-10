/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-4
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */

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


cc.CacheNode = cc.Node.extend({
    className : 'cc_CacheNode',
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
        this.isCacheNode = b;
        if(b == true) this.setDrawMode(cc.DRAW_MODE_CACHE);
    },
    isCacheNode : function(){
        return this.isCacheNode || false;
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

    _initImg : function(b, t){
        var ctx = this._cacheContext, canvas = this._cacheCanvas;
        ctx.clearRect(0, 0, canvas.width, -canvas.height);
        ctx.save();
        ctx.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
        if (b) {
            var l = b.length;
            for (var i = 0; i < l; i++) {
                b[i].visit(ctx);
            }
        }
        this.draw(ctx);
        if (t) {
            var l = t.length;
            for (var i = 0; i < l; i++) {
                t[i].visit(ctx);
            }
        }

        this._img = this._img || document.createElement("img");
        this._img.src = canvas.toDataURL("png");
        ctx.restore();
    },

    _append2Img : function(arr){
        var cxt = this._cacheContext, img = this._img;
        cxt.clearRect(0, 0, cxt.width, -cxt.height);
        cxt.save();
        cxt.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
        cxt.drawImage(img, 0, -1 * this._cacheCanvas.height);
        if (arr) {
            var l = arr.length;
            for (var i = 0; i < l; i++) {
                arr[i].visit(cxt);
            }
        }
        var data = cxt.toDataURL("png");
        cxt.restore();
        return data;

        var ctx = this._cacheContext, canvas = this._cacheCanvas;
        ctx.clearRect(0, 0, canvas.width, -canvas.height);
        ctx.save();
        ctx.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));

        cxt.drawImage(img, 0, -1 * this._cacheCanvas.height);
        if (arr) {
            var l = arr.length;
            for (var i = 0; i < l; i++) {
                arr[i].visit(cxt);
            }
        }

        this._img.src = canvas.toDataURL("png");
        ctx.restore();
    },

    _visit4Cache : function(ctx){
        var context = ctx || cc.renderContext;
        context.save();
        this.transform(context);
        this.sortAllChildren();
//        if(this._img && this._dirtyState != cc.DIRTY_TYPE_POLLUTE && this._dirtyState != cc.DIRTY_TYPE_SRC){
//            //TODO 如果自身不受污染，则只会画这步
//            ctx.drawImage(this._img, 0, 0);//TODO 画图
//            return;
//        }

        //TODO 需要考虑层级关系
        //TODO 先对children进行排序
        //TODO 找出children中dirtyArr以及appendArr

        var children = this._children, bottomArr = [], topArr = [], appendArr = [], dirtyArr = [], i, l;
        for(i = 0, l = children.length; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            topArr.push(child);
           /* var dirtyType = child.getDirtyType();
            if(child.isNeedToClear()){
                appendArr.push(child);
            }
            if(dirtyType == cc.DIRTY_TYPE_SRC || dirtyType == cc.DIRTY_TYPE_POLLUTE){
                dirtyArr.push(child);
            }
            if(dirtyType != cc.DIRTY_TYPE_SRC){
                if(child.getTag() > 0) bottomArr.push(child);
                else topArr.push(child);
            }*/
        }

        if(this.isCacheNode && this._isRecache){//TODO 第一次也要redraw，进行初始化
            //TODO 目前先做只有上层dirty的情况
            //TODO 先将相对于当前节点不动层画作一个img
            this._img = this._img || document.createElement("img");
            if(!this._cacheContext){
                this._cacheCanvas = document.createElement('canvas');
                this._cacheContext = this._cacheCanvas.getContext('2d');
                this._cacheContext.isCache = true;
                var size = cc.Director.getInstance().getWinSize();
                this._cacheCanvas.width = size.width;
                this._cacheCanvas.height = size.height;
                this._cacheContext.translate(0, this._cacheCanvas.height);
                this._img = this._img || document.createElement("img");
            }
            this._initImg(bottomArr, this._children);
//            context.drawImage(this._img, 0, -(0 + this._cacheCanvas.height));
            this._isRecache = false;
        }//此时img已经缓存完毕

        //有些节点需要追加
        if(appendArr.length > 0) this._append2Img(appendArr);

        //TODO 如果该节点是污染源，那么就应该将其img以及子感染者一起画上
        if(this._dirtyType == cc.DIRTY_TYPE_SRC){
            if(this._img){
                context.drawImage(this._img, 0, -1 * this._cacheCanvas.height);
                cc.g_NumberOfDraws++;
            }
            for(i = 0, l = dirtyArr.length; i < l; ++i){
                dirtyArr[i].visit(context);
            }
        }
        else if(this._dirtyType == cc.DIRTY_TYPE_POLLUTE){
            //这种情况下会有两种类型的context，一种是cacheContext，一种是当前画布的context
            if(context.isCache){
                context.drawImage(this._img, 0, -1 * this._cacheCanvas.height);
                cc.g_NumberOfDraws++;
            }else{
                for(i = 0, l = dirtyArr.length; i < l; ++i){
                    dirtyArr[i].visit(context);
                }
            }
        }else{
            if(this._img) {
                context.drawImage(this._img, 0, -1 * this._cacheCanvas.height);
                cc.g_NumberOfDraws++;
            }
        }
        context.restore();
    },


    setCacheDirty : function(b){
        this._cacheDirty1 = b || true;
    },

    init : function(){
        this._super();
        this.setAnchorPoint(tt.ANCHOR_POINT_BL);
        return true;
    },

    visit: function (ctx) {
        if (!this._visible)
            return;

        var l = this._children.length;
        if(this._drawMode == cc.DRAW_MODE_CACHE ){//如果是cache模式
            if(l > 0 && this.isCacheNode)this._visit4Cache(ctx);
            else if(l == 0){
                this._super(ctx);
            }else if(l > 0 && !this.isCacheNode){
                if(this._dirtyType == cc.DIRTY_TYPE_SRC) this._super(ctx);
            }
        }else if(!ctx.isCache){
            this._super(ctx);
        }
    }


});

tt.CacheLayer = cc.CacheNode.extend({
    className : 'tt_CacheLayer',

    _flag : 1,
    init : function(){
        this._super();

        var bg = cc.Sprite.create(Res.map_background_001_jpg);
        bg.setAnchorPoint(tt.ANCHOR_POINT_BL);
        this.addChild(bg);

        for(var i = 0; i < 10; ++i){
            for(var j = 0; j < 10; ++j){
                var sprite = cc.Sprite.create(Res.hero_border_1_png);
                this.addChild(sprite);
                sprite.setPosition(j * 20, i * 30);
                sprite.setAnchorPoint(tt.ANCHOR_POINT_BL);
            }
        }

        window.test = this;

        this._mvSp = cc.Sprite.create(Res.hero_border_1_png);
        this.addChild(this._mvSp);
        this._mvSp.setPosition(0, 400);
        this._mvSp.setAnchorPoint(tt.ANCHOR_POINT_BL);

        this._act = cc.MoveBy.create(2, cc.p(200, 0));

//        this.setTouchEnabled(true);
        this.setAnchorPoint(tt.ANCHOR_POINT_BL);
        this.setIsCacheNode(true);
        return true;
    },

    onTouchesEnded : function(touches, event){
        var func = cc.CallFunc.create(function(){
        }.bind(this));
        if(this._flag == 1){
            var act = cc.Sequence.create(this._act.copy(), func);
            this._mvSp.runAction(act);
            this._flag *= -1;
        }else{
            var act = cc.Sequence.create(this._act.reverse(), func);
            this._mvSp.runAction(act);
            this._flag *= -1;
        }

    }


});


tt.CacheLayer.create = function(args){
    var layer = new tt.CacheLayer();
    layer.init();
    return layer;
}
