/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-6
 * Time: 上午11:57
 * To change this template use File | Settings | File Templates.
 */


cc.DIRTY_TYPE_NO = 0;//不受污染
cc.DIRTY_TYPE_POLLUTE = 1;//污染
cc.DIRTY_TYPE_SRC = 2;//源头

cc.DIRTY_STATE_NO = -1;//正常状态
cc.DIRTY_STATE_CLEANING = 0;//污染刚被清除
cc.DIRTY_STATE_ONCE = 1;//只污染一次
cc.DIRTY_STATE_LONG = 2;//持续污染
cc.DIRTY_STATE_HAND = 3;//手动污染
cc.hasParentCacheStack = [];
cc.CacheNode = cc.Sprite.extend({
    _isRefresh : true,
    _isCacheNode : false,
    _dirtyState : null,
    _dirtyType : null,
    _cacheCanvas : null,
    _cacheContext : null,
    _img : null,

    setDirtySrc : function(){
        if(this._dirtyType == cc.DIRTY_TYPE_SRC) return;
        this._dirtyType = cc.DIRTY_TYPE_SRC;
        this._isRefresh = true;
        var parent = this.getParent();
        if(parent && parent.refresh) parent.refresh(cc.DIRTY_TYPE_POLLUTE);
    },
    clearDirtySrc : function(){
        if(this._dirtyType != cc.DIRTY_TYPE_SRC) return;
        var children = this._children, i = 0, l = children, flag = false;
        for(i = 0; i < l; i++){
            var child = children[i];
            if(child && child.isPolluted()){
                flag = true;
                break;
            }
        }
        if(flag) this._dirtyType = cc.DIRTY_TYPE_POLLUTE;
        else this._dirtyType = cc.DIRTY_TYPE_NO;
        this._isRefresh = true;
        var parent = this.getParent();
        if(parent && parent.refresh) parent.refresh(cc.DIRTY_TYPE_NO);
    },
    refresh : function(type){
        this._isRefresh = true;
        if(this._dirtyType == cc.DIRTY_TYPE_SRC) return;//已经通知过一次了
        if(type == cc.DIRTY_TYPE_POLLUTE){
            this._dirtyType = cc.DIRTY_TYPE_POLLUTE;
        }else{
            var children = this._children, i = 0, l = children, flag = false;
            for(i = 0; i < l; i++){
                var child = children[i];
                if(child && child.isPolluted()){
                    flag = true;
                    break;
                }
            }
            if(flag) this._dirtyType = cc.DIRTY_TYPE_POLLUTE;
            else this._dirtyType = cc.DIRTY_TYPE_NO;
        }
        var parent = this.getParent();
        if(parent && parent.refresh) parent.refresh(type);
    },
    setIsCacheNode : function(b){
        this._isCacheNode = b;
        if(!this._cacheContext){
            this._cacheCanvas = document.createElement('canvas');
            this._cacheContext = this._cacheCanvas.getContext('2d');
            this._cacheContext.isCache = true;
//                var size = cc.Director.getInstance().getWinSize();
            var size = this.getContentSize();
            this._cacheCanvas.width = size.width;
            this._cacheCanvas.height = size.height;
            tt.logSize(size);
            tt.logPos(this._anchorPointInPoints);
            this._cacheContext.translate(0, size.height);
            this._img = this._img || document.createElement("img");
        }
    },

    isPolluted : function(){
        return this._dirtyType == cc.DIRTY_TYPE_SRC || this._dirtyType == cc.DIRTY_TYPE_POLLUTE;
    },

    getDirtyType : function(){
        return this._dirtyType || cc.DIRTY_TYPE_NO;
    },

    _drawNoDirty : function(ctx){
        if(this._dirtyType == cc.DIRTY_TYPE_SRC) return;
//        cc.log("++++++++++_drawNoDirty++++++++++++");
        this.sortAllChildren();
        var children = this._children, l = children.length, i = 0;
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(child._zOrder >= 0) break;
            if(!child.getDirtyType || child.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
        this.draw(ctx);
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(!child.getDirtyType || child.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
    },
    _drawDirty : function(ctx){
//        cc.log("++++++++++_drawDirty++++++++++++");
        this.sortAllChildren();
        var children = this._children, l = children.length, i = 0;
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(child._zOrder >= 0) break;
            if(child.isPolluted && child.isPolluted()) child.visit(ctx);
        }
        if(this._dirtyType == cc.DIRTY_TYPE_SRC) this.draw(ctx);//只有自身是污染源的时候才会画
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(child.isPolluted && child.isPolluted()) child.visit(ctx);
        }
    },
    _drawCache : function(ctx){
//        cc.log("++++++++++_drawCache++++++++++++");
        if(this._isRefresh){
            console.time("1111");
            this.sortAllChildren();
            var buffCtx = this._cacheContext, buffCanvas = this._cacheCanvas, img = this._img;
            buffCtx.clearRect(0, 0, buffCanvas.width, -buffCanvas.height);
//            buffCtx.save();
//            buffCtx.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
            var children = this._children, l = children.length, i = 0;

            for(; i < l; ++i){
                var child = children[i];
                if(!child) continue;
                if(child._zOrder >= 0) break;
                if(!child.getDirtyType || child.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(buffCtx);
            }
            if(this._dirtyType != cc.DIRTY_TYPE_SRC) this.draw(buffCtx);//只有自身不是污染源的时候才会画
            for(; i < l; ++i){
                var child = children[i];
                if(!child) continue;
                if(!child.getDirtyType || child.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(buffCtx);
            }
            console.time("11112");
            img.src = this._cacheCanvas.toDataURL("png");
            console.timeEnd("11112");
//            buffCtx.restore();
            this._isRefresh = false;

            console.timeEnd("1111");
        }
        ctx.drawImage(this._img, 0, -1 * this._cacheCanvas.height);
        cc.g_NumberOfDraws++;
    },
    _visitOld:function (ctx) {
        // quick return if not visible
        if (!this._visible)
            return;

        //visit for canvas
        var i;
        var children = this._children,child;
        var len = children.length;
        if (len > 0) {
            this.sortAllChildren();
            // draw children zOrder < 0
            for (i = 0; i < len; i++) {
                child = children[i];
                if (child._zOrder < 0)
                    child.visit(ctx);
                else
                    break;
            }
            this.draw(ctx);
            for (; i < len; i++) {
                children[i].visit(ctx);
            }
        } else
            this.draw(ctx);

        this._orderOfArrival = 0;
    },


    visit : function(ctx){
        if(!this._visible) return;

        var context = ctx || cc.renderContext, i;
        context.save();
        this.transform(context);

        var isDirty = this._dirtyType == cc.DIRTY_TYPE_SRC || this._dirtyType == cc.DIRTY_TYPE_POLLUTE,
            hasCacheParent = cc.hasParentCacheStack.length > 0,
            isCacheNode = this._isCacheNode, children = this._children, l = children.length;
        if(isCacheNode) cc.hasParentCacheStack.push(true);

        if(!isDirty && !isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            this._visitOld(ctx);
        }else if(!isDirty && !isCacheNode && hasCacheParent){//TODO ctx只会是buff ctx
            this._visitOld(ctx);
        }else if(!isDirty && isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            if(l > 0) this._drawCache(ctx);
            else this.draw(ctx);
        }else if(!isDirty && isCacheNode && hasCacheParent){//TODO ctx只会是buff ctx
            if(l > 0) this._drawCache(ctx);
            else this.draw(ctx);
        }else if(isDirty && !isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            this._visitOld(ctx);
        }else if(isDirty && !isCacheNode && hasCacheParent){//TODO ctx可能是实时或者buff
            if(l > 0){
                if(ctx.isCache) this._drawNoDirty(ctx);
                else this._drawDirty(ctx);
            }else if(!ctx.isCache){
                this.draw(ctx);
            }
        }else if(isDirty && isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            if(l > 0) {
                this._drawCache(ctx);
                this._drawDirty(ctx);
            }
            else{
                this.draw(ctx);
            }
        }else if(isDirty && isCacheNode && hasCacheParent){//TODO ctx可能是实时或者buff
            if(l > 0){
                this._drawCache(ctx);
                this._drawDirty(ctx);
            }else if(!ctx.isCache){
                this.draw(ctx);
            }
        }else{
            cc.log("+++++++");
        }

        this._orderOfArrival = 0;
        context.restore();
        if(isCacheNode) cc.hasParentCacheStack.pop();
    }
});
cc.CacheNode.create = function (fileName, rect) {
    var argnum = arguments.length;
    var sprite = new cc.CacheNode();
    if (argnum === 0) {
        if (sprite.init())
            return sprite;
    } else {
        /** Creates an sprite with an image filename.
         If the rect equal undefined, the rect used will be the size of the image.
         The offset will be (0,0).
         */
        if (sprite && sprite.init(fileName, rect))
            return sprite;
    }
    return null;
};