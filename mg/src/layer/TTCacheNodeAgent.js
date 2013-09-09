

cc.DIRTY_TYPE_NO = 0;//不受污染
cc.DIRTY_TYPE_POLLUTE = 1;//污染
cc.DIRTY_TYPE_SRC = 2;//源头

cc.DIRTY_STATE_NO = -1;//正常状态
cc.DIRTY_STATE_CLEANING = 0;//污染刚被清除
cc.DIRTY_STATE_ONCE = 1;//只污染一次
cc.DIRTY_STATE_LONG = 2;//持续污染
cc.DIRTY_STATE_HAND = 3;//手动污染
cc.hasParentCacheStack = [];
cc.CacheNodeAgent = cc.Class.extend({
    isRefresh : true,
    isCacheNode : false,
    dirtyState : null,
    dirtyType : null,
    _cacheCanvas : null,
    _cacheContext : null,
    _img : null,
    _source : null,

    ctor : function(source){
        this._source = source;
    },

    setDirtySrc : function(){
        if(this.dirtyType == cc.DIRTY_TYPE_SRC) return;
        this.dirtyType = cc.DIRTY_TYPE_SRC;
        this.isRefresh = true;
        var parent = this._source.getParent();
        if(!parent) return;
        if(!parent.nodeAgent) parent.nodeAgent = new cc.CacheNodeAgent(parent);
        parent.nodeAgent.refresh(cc.DIRTY_TYPE_POLLUTE);
    },
    clearDirtySrc : function(){
        var node = this._source;
        if(this.dirtyType != cc.DIRTY_TYPE_SRC) return;
        var children = node._children, i = 0, l = children, flag = false;
        for(i = 0; i < l; i++){
            var child = children[i];
            if(child && child.nodeAgent && child.nodeAgent.isPolluted()){
                flag = true;
                break;
            }
        }
        if(flag) this.dirtyType = cc.DIRTY_TYPE_POLLUTE;
        else this.dirtyType = cc.DIRTY_TYPE_NO;
        this.isRefresh = true;
        var parent = this._source.getParent();
        if(!parent) return;
        if(!parent.nodeAgent) parent.nodeAgent = new cc.CacheNodeAgent(parent);
        parent.nodeAgent.refresh(cc.DIRTY_TYPE_NO);
    },
    refresh : function(type){
        var node = this._source;
        this.isRefresh = true;
        var parent = this._source.getParent();
        if(!parent){
            this.dirtyType = cc.DIRTY_TYPE_NO;
            return;
        }
        if(this.dirtyType == cc.DIRTY_TYPE_SRC) return;//已经通知过一次了
        if(type == cc.DIRTY_TYPE_POLLUTE){
            this.dirtyType = cc.DIRTY_TYPE_POLLUTE;
        }else{
            var children = node._children, i = 0, l = children, flag = false;
            for(i = 0; i < l; i++){
                var child = children[i];
                if(child && child.nodeAgent && child.nodeAgent.isPolluted()){
                    flag = true;
                    break;
                }
            }
            if(flag) this.dirtyType = cc.DIRTY_TYPE_POLLUTE;
            else this.dirtyType = cc.DIRTY_TYPE_NO;
        }
        if(!parent) return;
        if(!parent.nodeAgent) parent.nodeAgent = new cc.CacheNodeAgent(parent);
        parent.nodeAgent.refresh(type);
    },
    setIsCacheNode : function(b){
        var node = this._source;
        this.isCacheNode = b;
        if(!this._cacheContext){
            this._cacheCanvas = document.createElement('canvas');
            this._cacheContext = this._cacheCanvas.getContext('2d');
            this._cacheContext.isCache = true;
//                var size = cc.Director.getInstance().getWinSize();
            var size = node.getContentSize();
            this._cacheCanvas.width = size.width;
            this._cacheCanvas.height = size.height;
            this._cacheContext.translate(0, size.height);
            this._img = this._img || document.createElement("img");
        }
    },

    isPolluted : function(){
        return this.dirtyType == cc.DIRTY_TYPE_SRC || this.dirtyType == cc.DIRTY_TYPE_POLLUTE;
    },

    getDirtyType : function(){
        return this.dirtyType || cc.DIRTY_TYPE_NO;
    },

    _drawNoDirty : function(ctx){
        var node = this._source;
        if(this.dirtyType == cc.DIRTY_TYPE_SRC) return;
        node.sortAllChildren();
        var children = node._children, l = children.length, i = 0;
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(child._zOrder >= 0) break;
            var nodeAgent = child.nodeAgent;
            if( !nodeAgent || nodeAgent.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
        node.draw(ctx);
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            var nodeAgent = child.nodeAgent;
            if(!nodeAgent || nodeAgent.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
    },
    _drawDirty : function(ctx){
        var node = this._source;
        node.sortAllChildren();
        var children = node._children, l = children.length, i = 0;
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            if(child._zOrder >= 0) break;
            var nodeAgent = child.nodeAgent;
            if(nodeAgent && nodeAgent.isPolluted()) child.visit(ctx);
            else if(this.dirtyType == cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
        if(this.dirtyType == cc.DIRTY_TYPE_SRC) node.draw(ctx);//只有自身是污染源的时候才会画
        for(; i < l; ++i){
            var child = children[i];
            if(!child) continue;
            var nodeAgent = child.nodeAgent;
            if(nodeAgent && nodeAgent.isPolluted()) child.visit(ctx);
            else if(this.dirtyType == cc.DIRTY_TYPE_SRC) child.visit(ctx);
        }
    },
    _drawCache : function(ctx){
        var node = this._source;
        if(this.isRefresh){
            node.sortAllChildren();
            var buffCtx = this._cacheContext, buffCanvas = this._cacheCanvas, img = this._img;
            this._isDrawImg = buffCanvas.width * buffCanvas.height < 2500;
            buffCtx.clearRect(0, 0, buffCanvas.width, -buffCanvas.height);
            var children = node._children, l = children.length, i = 0;

            for(; i < l; ++i){
                var child = children[i];
                if(!child) continue;
                if(child._zOrder >= 0) break;
                var nodeAgent = child.nodeAgent;
                if(!nodeAgent || nodeAgent.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(buffCtx);
            }
            if(this.dirtyType != cc.DIRTY_TYPE_SRC) node.draw(buffCtx);//只有自身不是污染源的时候才会画
            for(; i < l; ++i){
                var child = children[i];
                if(!child) continue;
                var nodeAgent = child.nodeAgent;
                if(!nodeAgent || nodeAgent.getDirtyType() != cc.DIRTY_TYPE_SRC) child.visit(buffCtx);
            }
            if(this._isDrawImg) img.src = this._cacheCanvas.toDataURL("png");
            this.isRefresh = false;
        }
        if(this._isDrawImg) ctx.drawImage(this._img, 0, -1 * this._cacheCanvas.height);
        else ctx.drawImage(this._cacheCanvas, 0, -1 * this._cacheCanvas.height);
        cc.g_NumberOfDraws++;
    },

    visit : function(ctx){
        var node = this._source;
        if(!node._visible) return;

        var context = ctx || cc.renderContext, i;

        var isDirty = this.dirtyType == cc.DIRTY_TYPE_SRC || this.dirtyType == cc.DIRTY_TYPE_POLLUTE,
            hasCacheParent = cc.hasParentCacheStack.length > 0,
            isCacheNode = this.isCacheNode, children = node._children, l = children.length;
        if(isCacheNode) cc.hasParentCacheStack.push(true);

        if(!isDirty && !isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            return false;
        }else if(!isDirty && !isCacheNode && hasCacheParent){//TODO ctx只会是buff ctx
            return false;
        }else if(!isDirty && isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            context.save();
            node.transform(context);
            if(l > 0) this._drawCache(ctx);
            else node.draw(ctx);
            context.restore();
        }else if(!isDirty && isCacheNode && hasCacheParent){//TODO ctx只会是buff ctx
            context.save();
            node.transform(context);
            if(l > 0) this._drawCache(ctx);
            else node.draw(ctx);
            context.restore();
        }else if(isDirty && !isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            return false;
        }else if(isDirty && !isCacheNode && hasCacheParent){//TODO ctx可能是实时或者buff
            context.save();
            node.transform(context);
            if(l > 0){
                if(ctx.isCache) {
                    cc.log("ffff")
                    this._drawNoDirty(ctx);
                }
                else this._drawDirty(ctx);
            }else if(!ctx.isCache){
                node.draw(ctx);
            }
            context.restore();
        }else if(isDirty && isCacheNode && !hasCacheParent){//TODO ctx只会是实时ctx
            context.save();
            node.transform(context);
            if(l > 0) {
                this._drawCache(ctx);
                this._drawDirty(ctx);
            }
            else{
                node.draw(ctx);
            }
            context.restore();
        }else if(isDirty && isCacheNode && hasCacheParent){//TODO ctx可能是实时或者buff
            context.save();
            node.transform(context);
            if(l > 0){
                this._drawCache(ctx);
                this._drawDirty(ctx);
            }else if(!ctx.isCache){
                node.draw(ctx);
            }
            context.restore();
        }

        node._orderOfArrival = 0;
        if(isCacheNode) cc.hasParentCacheStack.pop();
        return true;
    }
});