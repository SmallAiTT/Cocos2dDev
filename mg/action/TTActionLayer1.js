/**
 * Created with JetBrains WebStorm.
 * User: small
 * Date: 13-9-10
 * Time: 下午4:21
 * To change this template use File | Settings | File Templates.
 */

tt.ActionLayer1 = cc.Layer.extend({
    _resPlist : null,
    _animTime : null,
    init : function(){
        this._super();

        var animFrames = [];
        var cache = cc.SpriteFrameCache.getInstance();
        cache.addSpriteFrames(this.resPlist);
        for(var i = 0; i < l; ++i){
            var frame = this.animTexs[i];
            animFrames.push(cache.getSpriteFrame(frame));
        }
        var animation = cc.Animation.create(animFrames, this.animTime);
        var animate = cc.Animate.create(animation);
        sprite.runAction(cc.RepeatForever.create(animate));
        return true;
    }
});

tt.ActionLayer1.create = function(args){
    var layer = new tt.ActionLayer1();
    return layer.init() ? layer : null;
};
