/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-11
 * Time: 下午9:00
 * To change this template use File | Settings | File Templates.
 */

dm.AniGenLayer = cc.Layer.extend({
    aniInfo : null,
    init : function(){
        this._super();
        var aniGen = tt.AniGen.create();
        var animate = aniGen.getAnimate(this.aniInfo);
        var sprite = cc.Sprite.create();
        sprite.runAction(cc.RepeatForever.create(animate));
        this.addChild(sprite);
        sprite.setPosition(tt.WIN_SIZE.width/2, tt.WIN_SIZE.height/2);
        return true;
    }
});
dm.AniGenLayer.create = function(args){
    var layer = new dm.AniGenLayer();
    layer.aniInfo = args.aniInfo;
    return layer.init() ? layer : null;
};