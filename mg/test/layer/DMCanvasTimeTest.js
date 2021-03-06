/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-9
 * Time: 下午5:33
 * To change this template use File | Settings | File Templates.
 */


dm.CanvasTimeTestLayer = cc.Layer.extend({
    className : 'dm_CanvasTimeTestLayer',

    init : function(){
        this._super();
        var n = cc.Sprite.create(Res.map_background_jpg);
        n.setContentSize(tt.WIN_SIZE);
        this.addChild(n);
        n.setAnchorPoint(tt.ANCHOR_POINT_BL);

        for(var i = 0; i < 100; ++i){
            for(var j = 0; j < 100; ++j){
                var sprite = cc.Sprite.create(Res.hero_border_1_png);
                n.addChild(sprite);
                sprite.setPosition(j * 20, i * 30);
                sprite.setAnchorPoint(tt.ANCHOR_POINT_BL);

                var s = cc.Sprite.create(Res.hero_border_1_png);
                sprite.addChild(s);
                s.setScale(0.5);
            }
        }
        n.setIsCacheNode(true);
        this.isRecordTime = 10;
        return true;
    }
});

dm.CanvasTimeTestLayer.create = function(args){
    var layer = new dm.CanvasTimeTestLayer();
    return layer.init() ? layer : null;
};
