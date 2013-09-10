/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-8-22
 * Time: 下午3:18
 * To change this template use File | Settings | File Templates.
 */

dm.CacheNode = cc.Node.extend({
    className : 'dm_CacheNode',

    _cacheCanvas: null,
    _cacheContext: null,
    _img : null,


    ctor: function () {
        cc.Node.prototype.ctor.call(this);
        this._cacheCanvas = document.createElement('canvas');
        this._cacheContext = this._cacheCanvas.getContext('2d');
    },

    init : function(){
        this._super();
        this.setAnchorPoint(cc.p(0.5, 0.5));
        return true;
    },

    setCacheDirty : function(b){
        this._cacheDirty = b || true;
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
//        this._cacheDirty = true;
        if (this._cacheDirty) {
//        if (true) {
            //add dirty region
            var locCacheContext = this._cacheContext, locCacheCanvas = this._cacheCanvas;
            locCacheContext.clearRect(0, 0, locCacheCanvas.width, -locCacheCanvas.height);
            locCacheContext.save();
            locCacheContext.translate(this._anchorPointInPoints.x, -(this._anchorPointInPoints.y ));
            if (locChildren) {
                this.sortAllChildren();
                for (i = 0; i < locChildren.length; i++) {
                    if (locChildren[i])
                        locChildren[i].visit(locCacheContext);
                }
            }
            locCacheContext.restore();
            this._cacheDirty = false;
        }
        // draw RenderTexture
        this.draw(ctx);
        context.restore();
    },


    draw: function (ctx) {
        var context = ctx || cc.renderContext;
        //context.globalAlpha = this._opacity / 255;
        var posX = 0 | ( -this._anchorPointInPoints.x), posY = 0 | ( -this._anchorPointInPoints.y);
        var locCacheCanvas = this._cacheCanvas;
        if(!this._img && locCacheCanvas){
            this._img = document.createElement("img");
            this._img.src = locCacheCanvas.toDataURL("png");
        }
        if (this._img) {
            //direct draw image by canvas drawImage
            context.drawImage(this._img, 0, -(0 + locCacheCanvas.height));
        }


        cc.g_NumberOfDraws++;
    }
});

dm.CacheNode.create = function(args){
    var node = new dm.CacheNode();
    return node.init() ? node : null;
};
dm.DragLayerTest = tt.DragLayer.extend({
    className : 'dm_DragLayerTest',

    _initRes : function(){
        this._super();
        var cacheNode = dm.CacheNode.create();
        var w = 0;
        var h = 0;
        for(var i = 0; i < 20; ++i){
            var sprite = cc.Sprite.create(Res.background_001_png);
            cacheNode.addChild(sprite);
            sprite.setPosition(w, 0);
            var size = sprite.getContentSize();
            w += size.width;
            h += size.height;
        }
        tt.logSize(cc.size(w, h));
//        cacheNode.setContentSize(cc.size(w, h));
        cacheNode.setContentSize(sprite.getContentSize());
        cacheNode.setCacheDirty(true);
        cacheNode.setScale(0.5);
        cacheNode.setPosition(tt.WIN_SIZE.width/2, tt.WIN_SIZE.height/2);
        this.addChild(cacheNode);
    },
    _onDragging : function(offset, touch, event){
        this._super(offset, touch, event);
    },

    _onDragEnded : function(touch, event){
        //TODO override here
    }

});

dm.DragLayerTest.create = function(args){
    var layer = new dm.DragLayerTest();
    return layer.init() ? layer : null;
};
