/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 13-9-10
 * Time: 下午11:35
 * To change this template use File | Settings | File Templates.
 */

cc.RESOLUTION_POLICY = {
    // The entire application is visible in the specified area without trying to preserve the original aspect ratio.
    // Distortion can occur, and the application may appear stretched or compressed.
    EXACTFIT : 0,
    // The entire application fills the specified area, without distortion but possibly with some cropping,
    // while maintaining the original aspect ratio of the application.
    NOBORDER : 1,
    // The entire application is visible in the specified area without distortion while maintaining the original
    // aspect ratio of the application. Borders can appear on two sides of the application.
    SHOW_ALL : 2,
    // The application takes the height of the design resolution size and modifies the width of the internal
    // canvas so that it fits the aspect ratio of the device
    // no distortion will occur however you must make sure your application works on different
    // aspect ratios
    HEIGHT : 3,
    // The application takes the width of the design resolution size and modifies the height of the internal
    // canvas so that it fits the aspect ratio of the device
    // no distortion will occur however you must make sure your application works on different
    // aspect ratios
    WIDTH : 4,
    UNKNOWN : 5
};

cc.Touches = [];
cc.TouchesIntergerDict = {};

cc.EGLView = cc.Class.extend({
    _delegate : null,
    _screenSize : null,//real screen size
    _designResolutionSize : null,//resolution size, it is the size appropriate for the app resources
    _viewPortRect : null,//the view port size
    _viewName : "",//the view name
    _scaleX : 1,
    _svcaleY : 1,
    _indexBitsUsed : 0,//TODO idn
    _maxTouches : 5,
    _resolutionPolicy : cc.RESOLUTION_POLICY.UNKNOWN,
    _initialize : false,

    _captured : false,
    _wnd : null,
    _hDC : null,
    _hRC : null,
    _accelerometerKeyHook : null,
    _supportTouch : false,
    _contentTranslateLeftTop : null,
    _supportTouch : false,
    _contentTranslateLeftTop : null,

    _menu : null,
    _wndProc : null,
    _ele : null,
    _frameZoomFactor : 1.0,

    cotr : function(){

    }

});