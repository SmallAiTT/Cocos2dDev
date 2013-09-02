/**
 * Created with JetBrains WebStorm.
 * User: Small
 * Date: 13-7-5
 * Time: 下午7:57
 * To change this template use File | Settings | File Templates.
 */

(function(){
    var d = document;
    var c = {
        COCOS2D_DEBUG: 2,
        showFPS : true,
        loadExtension: true,
        frameRate : 60,
        tag : "gameCanvas",
        renderMode:1,       //Choose of RenderMode: 0(default), 1(Canvas only), 2(WebGL only)
        engineDir : "../../123G/HTML5/cocos2d/",
//        engineDir : "../../../123G/HTML5Test/cocos2d/",

        runMode : "test",
        testCfg : "a"
    };

    window.addEventListener("DOMContentLoaded", function(){
        tt.initCfg(c);
        //first load engine file if specified
        var s = d.createElement('script');
        /*********Delete this section if you have packed all files into one*******/
        if (c.SingleEngineFile && !c.engineDir) {
            s.src = c.SingleEngineFile;
        }else if (c.engineDir && !c.SingleEngineFile) {
            s.src = c.engineDir + 'platform/jsloader.js';
        }else {
            alert('You must specify either the single engine file OR the engine directory in "cocos2d.js"');
        }
        /*********Delete this section if you have packed all files into one*******/

            //s.src = 'Packed_Release_File.js'; //IMPORTANT: Un-comment this line if you have packed all files into one

        d.body.appendChild(s);
        document.ccConfig = c;
        s.id = 'cocos2d-html5';
        //else if single file specified, load singlefile
    });
})();