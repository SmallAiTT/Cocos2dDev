/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-4
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */

tt.CacheLayer = cc.Layer.extend({
    _cacheCanvas: null,
    _cacheContext: null,
    _img : null,

    _mvSp : null,

    _start : false,
    _flag : 1,
    _act : null,


    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this._cacheCanvas = document.createElement('canvas');
        this._cacheContext = this._cacheCanvas.getContext('2d');
    },

    init : function(){
        this._super();
        this._cacheDirty1 = true;

        this.setContentSize(tt.WIN_SIZE);

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

        this.setTouchEnabled(true);
        this.setAnchorPoint(tt.ANCHOR_POINT_BL);
        return true;
    },

    onTouchesEnded : function(touches, event){
        this._mvSp.isDirtySrc = true;
        this._cacheDirty1 = true;
        var func = cc.CallFunc.create(function(){
            this._mvSp.isDirtySrc = false;
            this._mvSp.isAppend = true;
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

    },


    setCacheDirty : function(b){
        this._cacheDirty1 = b || true;
    },

    setContentSize: function (size) {
        if (!size)
            return;
        cc.Node.prototype.setContentSize.call(this, size);
        this._cacheCanvas.width = size.width;
        this._cacheCanvas.height = size.height;
        this._cacheContext.translate(0, this._cacheCanvas.height);
        this._positionsAreDirty = true;
    },

    visit: function (ctx) {
        if (cc.renderContextType === cc.WEBGL) {
            this._super();
            return;
        }

        var context = ctx || cc.renderContext;
        // quick return if not visible
        if (!this._visible)
            return;

        context.save();
        this.transform(ctx);
        var i, locChildren = this._children;
//        this._cacheDirty1 = true;


        var dirtySrcChildren = [];
        var appendChildren = [];

        locChildren.forEach(function(child){
            if(child && child.isDirtySrc) {
                dirtySrcChildren.push(child);
            }else if(child && child.isAppend){
                appendChildren.push(child);
            }
        });

        if (this._cacheDirty1) {
//        if (true) {
            //add dirty region
            var locCacheContext = this._cacheContext, locCacheCanvas = this._cacheCanvas;
            locCacheContext.clearRect(0, 0, locCacheCanvas.width, -locCacheCanvas.height);
            locCacheContext.save();
            locCacheContext.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
            if (locChildren) {
                this.sortAllChildren();
                for (i = 0; i < locChildren.length; i++) {
                    if (locChildren[i] && !locChildren[i].isDirtySrc)
                        locChildren[i].visit(locCacheContext);
                }
            }
            this._img = this._img || document.createElement("img");
            this._img.src = locCacheCanvas.toDataURL("png");
            locCacheContext.restore();
            this._cacheDirty1 = false;
        }
        if(appendChildren.length > 0){
            var locCacheContext = this._cacheContext, locCacheCanvas = this._cacheCanvas;
            locCacheContext.clearRect(0, 0, locCacheCanvas.width, -locCacheCanvas.height);
            locCacheContext.save();
            locCacheContext.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
            locCacheContext.drawImage(this._img, 0, -(0 + locCacheCanvas.height));
            appendChildren.forEach(function(child){
                child.visit(locCacheContext);
                child.isAppend = false;
            });
            this._img = this._img || document.createElement("img");
            this._img.src = locCacheCanvas.toDataURL("png");
            locCacheContext.restore();
            this.draw(ctx);
        }else{
            // draw RenderTexture
            this.draw(ctx);
        }
        if(dirtySrcChildren.length > 0){
            dirtySrcChildren.forEach(function(child){
                child.visit(context);
            });
        }
        context.restore();
    },


    draw: function (ctx) {
        var context = ctx || cc.renderContext;
        //context.globalAlpha = this._opacity / 255;
        var posX = 0 | ( -this._anchorPointInPoints.x), posY = 0 | ( -this._anchorPointInPoints.y);
        var locCacheCanvas = this._cacheCanvas;
        if (this._img) {
            //direct draw image by canvas drawImage
            context.drawImage(this._img, 0, -(0 + locCacheCanvas.height));
        }


        cc.g_NumberOfDraws++;
    }
});


tt.CacheLayer.create = function(args){
    var layer = new tt.CacheLayer();
    layer.init();
    return layer;
}