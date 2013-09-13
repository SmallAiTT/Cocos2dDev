/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-11
 * Time: 下午8:37
 * To change this template use File | Settings | File Templates.
 */

tt.AniGen = cc.Class.extend({
    hasInitMap : null,
    sfCache : null,
    ctor : function(plistArr){
        this.hasInitMap = {};
        this.sfCache = cc.SpriteFrameCache.getInstance();
        if(plistArr != null){
            var sfCache = this.sfCache;
            var hasInitMap = this.hasInitMap;
            for(var i = 0, l = plistArr.length; i < l; ++i){
                var plist = plistArr[i].plist;
                sfCache.addSpriteFrames(plist);
                hasInitMap[plist] = true;
            }
        }
    },
    getAnimate : function(aniInfo){
        var plist = aniInfo.plist;
        var sfCache = this.sfCache;
        var hasInitMap = this.hasInitMap;
        if(!hasInitMap[plist]){
            sfCache.addSpriteFrames(plist);
            hasInitMap[plist] = true;
        }
        var frames = aniInfo.frames;
        var aniFrames = [];
        for(var i = 0, l = aniInfo.frames.length; i < l; ++i){
            aniFrames.push(sfCache.getSpriteFrame(frames[i]));
        }
        cc.log(aniInfo.interval);
        var animation = cc.Animation.create(aniFrames, aniInfo.interval);
        return cc.Animate.create(animation);
    }
});
tt.AniGen.create = function(plistArr){
    var gen = new tt.AniGen(plistArr);
    return gen;
};
