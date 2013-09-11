/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-11
 * Time: 下午9:00
 * To change this template use File | Settings | File Templates.
 */

dm.AniTestLayer = cc.Layer.extend({
    aniInfo : null,
    init : function(){
        this._super();
        var sprite = cc.Sprite.create();
        sprite.runAction(cc.RepeatForever.create(tt.genAnimate(this.aniInfo)));
        this.addChild(sprite);
        return true;
    }
});
dm.AniTestLayer.create = function(args){
    var layer = new dm.AniTestLayer();
    layer.aniInfo = args.aniInfo;
    return layer.init() ? layer : null;
};