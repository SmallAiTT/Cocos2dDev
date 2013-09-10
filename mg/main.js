/**
 * Created with JetBrains WebStorm.
 * User: Small
 * Date: 13-7-5
 * Time: 下午8:29
 * To change this template use File | Settings | File Templates.
 */

var cocos2dApp = cc.Application.extend({
    className : 'cocos2dApp',
    config : document['ccConfig'],
    ctor : function(){
        this._super();
        cc.COCOS2D_DEBUG = this.config.COCOS2D_DEBUG;
        cc.setup(this.config.tag);    //设置ID相当于
        cc.AppController.shareAppController().didFinishLaunchingWithOptions();
    },

    applicationDidFinishLaunching : function(){
        tt.initBase();
        //初始化导演
        var director = cc.Director.getInstance();

        var searchPaths = [];
        searchPaths.push(this.config.resDir || "./");
        cc.FileUtils.getInstance().setSearchPaths(searchPaths);
        //设置分辨率
        //cc.EGLView.getInstance().setDesignResolutionSize(320, 480, cc.RESOLUTION_POLICY.SHOW_ALL);

        //打开FPS的显示
        director.setDisplayStats(this.config.showFPS);
        //设置FPS，默认为 1.0/60
        director.setAnimationInterval(1.0 / this.config.frameRate);

        if(this.config.runMode == "test") tt.test(this.config.testCfg);
        else{
            //TODO enter point for game
            cc.log("++++++++++++++++enter point for game++++++++++++")
            tt.test(this.config.testCfg);
        }
        return true;
    }

});

var myApp = new cocos2dApp();
