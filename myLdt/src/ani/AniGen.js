/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-11
 * Time: 下午8:37
 * To change this template use File | Settings | File Templates.
 */

tt.AniGen = cc.Class.extend({
    hasInitMap : null,
    ctor : function(){
        this.hasInitMap = {};
    },
    initRes : function(plistArr){},
    gen : function(aniInfo){
        if(!this.hasInitMap[aniInfo.plist]){
            cc.SpriteFrameCache.getInstance().addSpriteFrames(aniInfo.plist);
            this.hasInitMap[aniInfo.plist] = true;
        }
        var animation = cc.Animation.create(aniInfo.frames, aniInfo.interval);
        return cc.Animate.create(animation);
    },
    load : function(sprite, aniInfo){

        var aniFrames = [];
        aniFrames.push(frame0);
        aniFrames.push(frame1);

        // ship animate
        var animation = cc.Animation.create(aniFrames, 0.1);
        var animate = cc.Animate.create(animation);
        this.runAction(cc.RepeatForever.create(animate));
        this.schedule(this.shoot, 1 / 6);
    }
});
tt.AniGen.create = function(){

};
