function inherit(proto){function F(){}return F.prototype=proto,new F}function extend(Child,Parent){Parent.prototype.constructor=Parent,Child.prototype=inherit(Parent.prototype),Child.prototype.constructor=Child,Child.parent=Parent.prototype}function touchSpin(){return{restrict:"A",scope:{spinOptions:"="},link:function(scope,element,attrs){scope.$watch(scope.spinOptions,function(){render()});var render=function(){$(element).TouchSpin(scope.spinOptions)}}}}function propsFilter(){return function(items,props){var out=[];return angular.isArray(items)?items.forEach(function(item){for(var itemMatches=!1,keys=Object.keys(props),i=0;i<keys.length;i++){var prop=keys[i],text=props[prop].toLowerCase();if(item[prop].toString().toLowerCase().indexOf(text)!==-1){itemMatches=!0;break}}itemMatches&&out.push(item)}):out=items,out}}!function($){function fixWrapperHeight(){var headerH=62,navigationH=$("#navigation").height(),contentH=$("div.content").height(),windowH=$(window).height();contentH<navigationH?$("#wrapper").css("min-height",(navigationH<windowH?windowH-headerH:navigationH)+"px"):contentH>navigationH&&contentH<windowH&&$("#wrapper").css("min-height",windowH-headerH+"px")}function setBodySmall(){$(this).width()<769?$("body").addClass("page-small"):$("body").removeClass("page-small show-sidebar")}function setPanelSize(){var $wrapper=$("#wrapper"),height=$(this).height()-$("#logo").height()-$(".color-line").height();$wrapper.height()<height&&$wrapper.css("height",height+"px")}$(function(){fixWrapperHeight(),setBodySmall(),setPanelSize()}),$(window).on("load",function(){$("div.splash").css("display","none")}).on("resize click",function(){setBodySmall(),setPanelSize(),setTimeout(function(){fixWrapperHeight()},300)})}(jQuery),function(){"use strict";window.chaos=angular.module("homer",["ngSanitize","ui.router","ui.select","datatables","angular-jwt","checklist-model","ngFileUpload"]),window.swal&&(window.alert=function(message,text,type){swal(String(message),text,type)},window.confirm=function(message,options,handler,context){return!!swal(angular.extend({title:message||"Are you sure?",text:"You won't be able to undo this action, and you may also lose any data entered",type:"warning",showCancelButton:!0,showLoaderOnConfirm:!0,confirmButtonText:"Yes, do it"},options),function(isConfirm){isConfirm&&"function"==typeof handler&&handler.call(context)})}),window.notify||(window.notify=function(message,options){window.Snarl?Snarl.addNotification(angular.extend({text:message,icon:'<i class="fa fa-info-circle"></i>'},options)):alert.apply(null,arguments)})}(),function(){"use strict";function configBlocks($compileProvider,$httpProvider,$urlRouterProvider,jwtInterceptorProvider){jwtInterceptorProvider.tokenGetter=function($http,config,jwtHelper){if(".html"===config.url.substr(config.url.length-5))return null;var token=Lockr.get(CONFIG.cookie.name+"_jwt");return token?jwtHelper.isTokenExpired(token)?$http({url:$http.defaults.route+"auth/renewtoken?token="+token,skipAuthorization:!0,method:"POST"}).then(function(response){if(response.headers("authorization"))return token=(response.headers("authorization")+"").replace(/bearer\s*/i,""),Lockr.set(CONFIG.cookie.name+"_jwt",token),token}):token:null},$httpProvider.interceptors.push("jwtInterceptor"),$httpProvider.interceptors.push("RequestProvider"),$httpProvider.defaults.useXDomain=!0,$httpProvider.defaults.withCredentials=!0,delete $httpProvider.defaults.headers.common["X-Requested-With"],$compileProvider.debugInfoEnabled(!1),$urlRouterProvider.otherwise(function($injector){$injector.get("$state").go(CONFIG.app.defaultRoute||"setting.index",{},{reload:!0})})}function runBlocks($cacheFactory,$http,$rootScope,$state,jwtHelper){$rootScope.$on("$stateChangeStart",function(event,toState){if("logout"!==toState.name&&!0!==toState.guest){var token=Lockr.get(CONFIG.cookie.name+"_jwt");if(!token)return event.preventDefault(),$rootScope.error="Invalid or expired session",$state.go("login",{},{reload:!0});if(!$rootScope.$user){var decoded=jwtHelper.decodeToken(token);$rootScope.$user=decoded.res}}}),$rootScope.$on("unauthenticated",function(){$state.go("login",{},{reload:!0})}),$rootScope.$state=$state,$rootScope.moment=window.moment,$rootScope.CONFIG=window.CONFIG||{},$rootScope.LANG=window.LANG||{},$rootScope.$watch("toast",function(newValue){void 0!==newValue&&(notify(newValue),delete $rootScope.toast)}),$http.defaults.$cacheFactory=$cacheFactory,$http.defaults.route=CONFIG.app.url+"/api/"}chaos.config(configBlocks).run(runBlocks)}(),function(_){function minimizeMenu($rootScope){return{restrict:"A",link:function(scope,element,attrs){element.bind("click",function(){0==$rootScope.isMinimizedMenu||null==$rootScope.isMinimizedMenu?$rootScope.isMinimizedMenu=1:$rootScope.isMinimizedMenu=0,Lockr.set("isMinimizedMenu",$rootScope.isMinimizedMenu),scope.$apply()})}}}function backButton(){return{restrict:"A",link:function(scope,element,attrs){element.bind("click",function(){history.back(),scope.$apply()})}}}function unescape(){return{restrict:"A",require:"ngModel",link:function(scope,element,attrs,ngModel){ngModel.$parsers.unshift(function(value){return _.unescape(value).replace(/&#0?39;|&apos;/g,"'").replace(/&#0?34;/g,'"')}),ngModel.$formatters.unshift(function(value){if(value)return _.unescape(value).replace(/&#0?39;|&apos;/g,"'").replace(/&#0?34;/g,'"')})}}}function ifRole(){return{restrict:"A",link:function(scope,element,attrs){scope.$user&&scope.$user.Permissions&&scope.$user.Permissions[attrs.ifRole]||element.remove()}}}function pageTitle($rootScope){return{link:function(scope,element,attrs){$rootScope.$on("$stateChangeSuccess",function(event,toState){element.text(toState.data&&toState.data.pageTitle?toState.data.pageTitle+" | "+attrs.pageTitle:attrs.pageTitle)})}}}function sideNavigation($timeout){return{restrict:"A",link:function(scope,element){element.metisMenu();var menuElement=$('#side-menu a:not([href$="\\#"])');menuElement.click(function(){$(window).width()<769&&$("body").toggleClass("show-sidebar")})}}}function minimalizaMenu($rootScope){return{restrict:"EA",template:'<div class="header-link hide-menu" ng-click="minimalize()"><i class="fa fa-bars"></i></div>',controller:function($scope,$element){$scope.minimalize=function(){$(window).width()<769?$("body").toggleClass("show-sidebar"):$("body").toggleClass("hide-sidebar")}}}}function sparkline(){return{restrict:"A",scope:{sparkData:"=",sparkOptions:"="},link:function(scope,element,attrs){scope.$watch(scope.sparkData,function(){render()}),scope.$watch(scope.sparkOptions,function(){render()});var render=function(){$(element).sparkline(scope.sparkData,scope.sparkOptions)}}}}function icheck($timeout){return{restrict:"A",require:"ngModel",link:function($scope,element,$attrs,ngModel){return $timeout(function(){var value;return value=$attrs.value,$scope.$watch($attrs.ngModel,function(newValue){$(element).iCheck("update")}),$(element).iCheck({checkboxClass:"icheckbox_square-green",radioClass:"iradio_square-green"}).on("ifChanged",function(event){if("checkbox"===$(element).attr("type")&&$attrs.ngModel&&$scope.$apply(function(){return ngModel.$setViewValue(event.target.checked)}),"radio"===$(element).attr("type")&&$attrs.ngModel)return $scope.$apply(function(){return ngModel.$setViewValue(value)})})})}}}function panelTools($timeout){return{restrict:"A",scope:!0,templateUrl:"views/common/panel-tools.html",controller:function($scope,$element){$scope.showhide=function(){var hpanel=$element.closest("div.hpanel"),icon=$element.find("i:first"),body=hpanel.find("div.panel-body"),footer=hpanel.find("div.panel-footer");body.slideToggle(300),footer.slideToggle(200),icon.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),hpanel.toggleClass("").toggleClass("panel-collapse"),$timeout(function(){hpanel.resize(),hpanel.find("[id^=map-]").resize()},50)},$scope.closebox=function(){var hpanel=$element.closest("div.hpanel");hpanel.remove()}}}}function smallHeader(){return{restrict:"A",scope:!0,controller:function($scope,$element){$scope.small=function(){var icon=$element.find("i:first"),breadcrumb=$element.find("#hbreadcrumb");$element.toggleClass("small-header"),breadcrumb.toggleClass("m-t-lg"),icon.toggleClass("fa-arrow-up").toggleClass("fa-arrow-down")}}}}function animatePanel($timeout,$state){return{restrict:"A",link:function(scope,element,attrs){var startAnimation=0,delay=.06,start=Math.abs(delay)+startAnimation,currentState=$state.current.name;attrs.effect||(attrs.effect="zoomIn"),delay=attrs.delay?attrs.delay/10:.06,attrs.child?attrs.child="."+attrs.child:attrs.child=".row > div";var panel=element.find(attrs.child);panel.addClass("opacity-0");var renderTime=panel.length*delay*1e3+700;$timeout(function(){panel=element.find(attrs.child),panel.addClass("animated-panel").addClass(attrs.effect),panel.each(function(i,elm){start+=delay;var rounded=Math.round(10*start)/10;$(elm).css("animation-delay",rounded+"s"),$(elm).removeClass("opacity-0")}),$timeout(function(){currentState==$state.current.name&&$(".animated-panel:not([ng-repeat])").removeClass(attrs.effect)},renderTime)})}}}function landingScrollspy(){return{restrict:"A",link:function(scope,element,attrs){element.scrollspy({target:".navbar-fixed-top",offset:80})}}}chaos.directive("backButton",backButton).directive("unescape",unescape).directive("ifRole",ifRole).directive("pageTitle",pageTitle).directive("sideNavigation",sideNavigation).directive("minimalizaMenu",minimalizaMenu).directive("sparkline",sparkline).directive("icheck",icheck).directive("panelTools",panelTools).directive("smallHeader",smallHeader).directive("animatePanel",animatePanel).directive("landingScrollspy",landingScrollspy).directive("minimizeMenu",minimizeMenu)}(_),angular.module("homer").directive("touchSpin",touchSpin),angular.module("homer").filter("propsFilter",propsFilter),function(){function Anonymous(){function AbstractModel(data,fields){if($data=data||{},void 0!==fields)for(var i=0,len=fields.length;i<len;i++)this[fields[i][map.data]]=$data[fields[i][map.data]]||fields[i][map.value]}var $data,map={data:"data",value:"value"};return AbstractModel.prototype={getData:function(){return $data}},AbstractModel}chaos.factory("AbstractModel",Anonymous)}(),function(){"use strict";function Anonymous(){function AbstractRepository($httpProvider,model){$http=$httpProvider,this.model=model,this.route=($http.defaults.route||"/api/")+model.getRoute()}var $http;return AbstractRepository.prototype={index:function(params){var me=this;return $http.get(this.route,{params:params,cache:!0}).then(function(response){return response.data.success&&(response.data.data=me.exchangeArray(response.data.data,me.model)),response.data})},store:function(model){return this.refine(),$http.post(this.route,model)},show:function(id){var me=this;return $http.get(this.route+"/"+id,{cache:!0}).then(function(response){return response.data.success&&(response.data.data=me.exchangeObject(response.data.data,me.model)),response.data})},update:function(model,id){return this.refine(),$http.put(this.route+"/"+id,model)},destroy:function(id){return this.refine(),$http["delete"](this.route+"/"+id)},refine:function(){return"function"==typeof $http.defaults.$cacheFactory&&$http.defaults.$cacheFactory.get("$http").removeAll(),this},exchangeObject:function(data,model){return new model(data)},exchangeArray:function(data,model){if(Array.isArray(data)){var i,collection=[],len=data.length;for(i=0;i<len;i++)collection.push(this.exchangeObject(data[i],model));return collection}return this.exchangeObject(data,model)}},AbstractRepository}chaos.factory("AbstractRepository",Anonymous)}(),function(){"use strict";function Anonymous($compile){function AbstractController($rootScopeProvider,repository){$scope=$rootScopeProvider,this.repository=repository,this.route=$scope.$state.get("^.index")?"^.index":"^"}var map={id:"Id",data:"data",success:"success",total:"total",start:"start",length:"length"},$scope;return AbstractController.prototype={index:function(params){return this.repository.index(params).then(function(response){$scope.collection=Object(response)[map.data]}),this},create:function(){return"function"==typeof this.beforeForm&&this.beforeForm.call(this,void 0,!0),$scope.model=this.repository.exchangeObject({},this.repository.model),$scope.mistr=angular.copy($scope.model),"function"==typeof this.afterForm&&this.afterForm.call(this,void 0,void 0,!0),this},store:function(model){return this.save(model,void 0,!0)},show:function(id){return this.edit(id)},edit:function(id){if(!id)throw new Error("Your request is invalid");"function"==typeof this.beforeForm&&this.beforeForm.call(this,id,!1);var me=this,handler=function(response){if(!response[map.success])throw new Error(response[map.data]||"Your request is invalid");$scope.model=response[map.data],$scope.mistr=angular.copy($scope.model),"function"==typeof me.afterForm&&me.afterForm.call(me,id,response,!1)};if(void 0!==$scope.collection){var model=_.findWhere($scope.collection,eval("({"+map.id+":"+("number"==typeof id?id:'"'+String(id).replace(/"/g,"&quot;")+'"')+"})"));handler({data:model,success:void 0!==model})}else this.repository.show(id).then(function(response){handler(Object(response))},function(response){handler({data:response.data.error||response.statusText,success:!1})});return this},update:function(model,id){return this.save(model,id,!1)},destroy:function(id){if(!id)throw new Error("Your request is invalid");"function"==typeof this.beforeDestroy&&this.beforeDestroy.call(this,id);var me=this;return confirm("Are you sure?",void 0,function(){me.repository.destroy(id).then(function(response){"function"==typeof me.afterDestroy&&me.afterDestroy.call(me,id,response),$scope.$parent.toast="Deleted successfully",$scope.$state.reload()},function(){$scope.$parent.toast="Deleted unsuccessfully, maybe it is in use"})}),this},bootstrap:function(mode){switch(mode||(mode=void 0!==$scope.$state.current.data.isNew?"form":"grid"),mode){case"form":!1===$scope.$state.current.data.isNew?this.edit($scope.$state.params.id):this.create();break;default:$scope.dtColumns=this.getDTColumns($scope.dtColumns),$scope.dtOptions=this.getDTOptions($scope.dtOptions)}},cancel:function(model){return model||(model=Object($scope.model)),angular.equals(model,Object($scope.mistr))?$scope.$state.go(this.route):(confirm("Are you sure?",void 0,function(){$scope.$state.go(this.route)},this),this)},reset:function(){return $scope.model=angular.copy($scope.mistr),this},save:function(model,id,isNew){if("boolean"!=typeof isNew&&(isNew=Boolean($scope.$state.current.data.isNew)),model||(model=Object($scope.model)),!isNew&&(id||(id=$scope.$state.params.id||model.Id||!1),!id))throw new Error("Your request is invalid");if("function"==typeof this.beforeSave&&this.beforeSave.call(this,model,id,isNew),angular.equals(model,Object($scope.mistr)))return $scope.$parent.toast="There are no changes",$scope.$state.reload();var me=this,handler=function(model,id,isNew){"function"==typeof me.afterSave&&me.afterSave.call(me,model,id,isNew),delete $scope.$parent.error,$scope.$parent.toast="Data saved successfully",$scope.$state.go(me.route)};return isNew?this.repository.store(model).then(function(){handler(model,void 0,!0)},function(response){$scope.$parent.error=response.data.error||response.statusText}):this.repository.update(model,id).then(function(){handler(model,id,!1)},function(response){$scope.$parent.error=response.data.error||response.statusText}),this},getDTColumns:function(options){var columns=this.repository.model.getFields();if(!1!==options){var state=$scope.$state.$current.parent.name||$scope.$state.current.name,actions=Object(options).ops||["edit","destroy"];columns.push({data:null,"class":"col-sm-1 text-center",sortable:!1,render:function(model){return'<a class="btn btn-success btn-xs" title="View Details" ng-if="'+(-1!==actions.indexOf("show"))+'" ui-sref="'+state+".show({ id: "+model.Id+' })"><i class="fa fa-file-text-o"></i></a> <a class="btn btn-info btn-xs" title="Edit" ng-if="'+(-1!==actions.indexOf("edit"))+'" ui-sref="'+state+".edit({ id: "+model.Id+' })"><i class="fa fa-edit"></i></a> <a class="btn btn-danger btn-xs" title="Delete" ng-if="'+(-1!==actions.indexOf("destroy"))+'" ng-click="ctrl.destroy('+model.Id+')"><i class="fa fa-trash-o"></i></a>'}})}return columns},getDTOptions:function(options){var me=this;return angular.extend({aaSorting:[],oLanguage:{sUrl:"l10n/datatables/en.json"},processing:!0,serverSide:!0,sAjaxDataProp:map.data,ajax:function(data,callback){var params=eval("({"+map.start+":"+data.start+","+map.length+":"+data.length+"})"),sort=[],i;if(0!==data.order.length){for(i in data.order)data.order.hasOwnProperty(i)&&sort.push({property:data.columns[data.order[i].column].data,direction:data.order[i].dir.toUpperCase()});0!==sort.length&&(params.sort=angular.toJson(sort))}3<=data.search.value.length&&(params.filter=data.search.value),me.repository.index(params).then(function(response){$scope.$parent.collection=(response=Object(response))[map.data],callback(angular.extend(response,{draw:data.draw,recordsTotal:response[map.total],recordsFiltered:response[map.total]}))})},fnCreatedRow:function(row){$compile(row)($scope)},fnInitComplete:function(){$scope.$parent.dtInstance=this.fnSetFilteringDelay()}},options)},beforeForm:void 0,afterForm:void 0,beforeSave:void 0,afterSave:void 0,beforeDestroy:void 0,afterDestroy:void 0},AbstractController}chaos.factory("AbstractController",Anonymous)}(),function(){"use strict";function RequestProvider(){this.$get=["$q","$rootScope",function($q,$rootScope){return{responseError:function(response){if(401===response.status);else switch(response.data.error){case"token_expired":case"token_not_provided":case"token_invalid":case"user_not_found":$rootScope.$broadcast("unauthenticated",response);break;case"csrf_invalid":location.reload(!0);break;default:418!==response.status&&alert("Oops...",response.data.error,"error")}return $q.reject(response)}}}]}chaos.provider("RequestProvider",RequestProvider)}(),function(){function Anonymous(AbstractModel){function LoginModel(data){LoginModel.parent.constructor.apply(this,[data,LoginModel.getFields()])}return extend(LoginModel,AbstractModel),LoginModel.getRoute=function(){return"auth/login"},LoginModel.getFields=function(){return[{data:"email",value:""},{data:"password",value:""},{data:"remember_token",value:!0}]},LoginModel}chaos.service("LoginModel",Anonymous)}(),function(){function Anonymous($http,LoginModel,AbstractRepository){function LoginRepository(){LoginRepository.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(LoginRepository,AbstractRepository),new LoginRepository}chaos.service("LoginRepository",Anonymous)}(),function(){function Anonymous($scope,LoginRepository,AbstractController){function LoginController(){LoginController.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(LoginController,AbstractController),LoginController.prototype.login=function(model){return this.repository.store(model).then(function(response){delete $scope.$parent.error,Lockr.set(CONFIG.cookie.name+"_jwt",response.data.token),$scope.$state.go(CONFIG.app.defaultRoute,{},{reload:!0})},function(response){$scope.$parent.error=response.data.error||"Could not log in"}),this},LoginController.prototype.logout=function(model){return this.repository.store(model).then(function(){$scope.$state.go("login",{},{reload:!0})})["finally"](function(){Lockr.rm(CONFIG.cookie.name+"_jwt")}),this},LoginController.prototype.recovery=function(model){return this.repository.store(model).then(function(){delete $scope.$parent.error,$scope.$parent.toast="Please check your email for the reset password instructions",$scope.$state.go("login",{},{reload:!0})},function(response){$scope.$parent.error=response.data.error||"Your email is invalid"}),this},LoginController.prototype.reset=function(model){return model.password!==model.confirmPassword?$scope.$parent.error="Password does not match the confirm password":(this.repository.store(model).then(function(){delete $scope.$parent.error,$scope.$state.go("login",{},{reload:!0})},function(response){$scope.$parent.error=response.data.error||"Could not reset password"}),this)},new LoginController}chaos.controller("LoginController",Anonymous)}(),function(){function configBlocks($stateProvider){$stateProvider.state("login",{url:"/login",templateUrl:"views/system/auth/login.html",data:{pageTitle:"Login",specialClass:"blank"},controller:"LoginController as ctrl",onEnter:function(){switch((CONFIG.auth||{})["default"]){case"oauth2":var url=CONFIG.auth.redirectUri,token=Lockr.get(CONFIG.cookie.name+"_ret");return token&&(url+="?grant=refresh_token&refresh_token="+token),location.replace(url);default:Lockr.rm(CONFIG.cookie.name+"_jwt")}},guest:!0}).state("logout",{templateUrl:"views/system/auth/logout.html",controller:"LoginController as ctrl"}).state("recovery",{url:"/recovery",templateUrl:"views/system/auth/recovery.html",data:{pageTitle:"Recovery Password",specialClass:"blank"},controller:"LoginController as ctrl",guest:!0}).state("reset",{url:"/reset",templateUrl:"views/system/auth/reset.html",data:{pageTitle:"Reset Password",specialClass:"blank"},controller:"LoginController as ctrl",guest:!0}).state("oauth2",{url:"/oauth2",controller:"LoginController as ctrl",onEnter:function($state){var parts=location.hash.split("?s=")[1].split("&r=");if(parts[0])return Lockr.set(CONFIG.cookie.name+"_jwt",parts[0]),Lockr.set(CONFIG.cookie.name+"_ret",parts[1]),$state.go(CONFIG.app.defaultRoute,{},{reload:!0});throw new Error("invalid_token")},guest:!0})}chaos.config(configBlocks)}(),function(){function Anonymous(AbstractModel){function AuditModel(data){AuditModel.parent.constructor.apply(this,[data,AuditModel.getFields()])}return extend(AuditModel,AbstractModel),AuditModel.getRoute=function(){return"audit"},AuditModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",title:"Name",value:"","class":"col-xs-2"},{data:"Action",title:"Action",value:"","class":"col-xs-2"},{data:"Information",title:"Information",value:"","class":"text-wrap",sortable:!1},{data:"Type",value:"",visible:!1},{data:"IpAddress",value:"",visible:!1},{data:"Request",value:"",visible:!1},{data:"Params",value:"",visible:!1},{data:"Referrer",value:"",visible:!1},{data:"CreatedAt",title:"Date",value:"","class":"col-xs-2",render:function(data){return data&&data.date||data}}]},AuditModel}chaos.service("AuditModel",Anonymous)}(),function(){function Anonymous($http,AuditModel,AbstractRepository){function AuditRepository(){AuditRepository.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(AuditRepository,AbstractRepository),new AuditRepository}chaos.service("AuditRepository",Anonymous)}(),function(){function Anonymous($scope,AuditRepository,AbstractController){function AuditController(){AuditController.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(AuditController,AbstractController),new AuditController}chaos.controller("AuditController",Anonymous)}(),function(){function configBlocks($stateProvider){$stateProvider.state("audit",{url:"/audit",views:{"":{templateUrl:"views/common/content-small.html"},"@audit":{templateUrl:"views/common/simple-grid.html",controller:"AuditController as ctrl"}},data:{pageTitle:"Audit Trails",pageDesc:"From here you can browse all of the latest audit trails"},onEnter:function($rootScope){$rootScope.dtColumns={ops:["show","destroy"]}},onExit:function($rootScope){delete $rootScope.dtColumns}}).state("audit.show",{url:"/show/{id:int}",views:{"":{templateUrl:"views/common/simple-details.html",controller:"AuditController as ctrl"},"@audit.show":{templateUrl:"views/system/audit/details.html"}},data:{pageTitle:"Audit Trails",pageDesc:"From here you can view details of an existing audit trail",isNew:!1}})}chaos.config(configBlocks)}(),function(){function Anonymous(AbstractModel){function LookupModel(data){LookupModel.parent.constructor.apply(this,[data,LookupModel.getFields()])}return extend(LookupModel,AbstractModel),LookupModel.getRoute=function(){return"lookup"},LookupModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",title:"Name",value:"",sortable:!1},{data:"Code",title:"Code",value:0,"class":"col-xs-1 text-center",sortable:!1},{data:"Type",title:"Type",value:""},{data:"Position",title:"Position",value:0,"class":"col-xs-1 text-center",sortable:!1}]},LookupModel}chaos.service("LookupModel",Anonymous)}(),function(){function Anonymous($http,LookupModel,AbstractRepository){function LookupRepository(){LookupRepository.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(LookupRepository,AbstractRepository),new LookupRepository}chaos.service("LookupRepository",Anonymous)}(),function(){function Anonymous($scope,LookupRepository,AbstractController){function LookupController(){LookupController.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(LookupController,AbstractController),new LookupController}chaos.controller("LookupController",Anonymous)}(),function(){function configBlocks($stateProvider){$stateProvider.state("lookup",{url:"/lookup",templateUrl:"views/common/content-small.html",data:{pageTitle:"Lookup"},controller:"LookupController as ctrl","abstract":!0}).state("lookup.index",{url:"",templateUrl:"views/common/simple-grid.html",data:{pageTitle:"Manage Lookups",pageDesc:"From here you can browse all of the latest lookup values"}}).state("lookup.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@lookup.create":{templateUrl:"views/system/lookup/form.html"}},data:{pageTitle:"New Lookup",pageDesc:"From here you can create a new lookup value",isNew:!0}}).state("lookup.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@lookup.edit":{templateUrl:"views/system/lookup/form.html"}},data:{pageTitle:"Edit Lookup",pageDesc:"From here you can edit an existing lookup value",isNew:!1}})}chaos.config(configBlocks)}(),function(){function Anonymous(AbstractModel){function SettingModel(data){SettingModel.parent.constructor.apply(this,[data,SettingModel.getFields()])}return extend(SettingModel,AbstractModel),SettingModel.getRoute=function(){return"setting"},SettingModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",title:"Name",value:"","class":"col-xs-3"},{data:"Value",title:"Value",value:"","class":"text-wrap",sortable:!1},{data:"Description",value:"",visible:!1}]},SettingModel}chaos.service("SettingModel",Anonymous)}(),function(){function Anonymous($http,SettingModel,AbstractRepository){function SettingRepository(){SettingRepository.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(SettingRepository,AbstractRepository),new SettingRepository}chaos.service("SettingRepository",Anonymous)}(),function(){function Anonymous($scope,SettingRepository,AbstractController){function SettingController(){SettingController.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(SettingController,AbstractController),new SettingController}chaos.controller("SettingController",Anonymous)}(),function(){function configBlocks($stateProvider){$stateProvider.state("setting",{url:"/setting",templateUrl:"views/common/content-small.html",data:{pageTitle:"Setting"},controller:"SettingController as ctrl","abstract":!0}).state("setting.index",{url:"",templateUrl:"views/common/simple-grid.html",data:{pageTitle:"Manage Settings",pageDesc:"From here you can browse all of the latest settings"}}).state("setting.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@setting.create":{templateUrl:"views/system/setting/form.html"}},data:{pageTitle:"New Setting",pageDesc:"From here you can create a new setting",isNew:!0}}).state("setting.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@setting.edit":{templateUrl:"views/system/setting/form.html"}},data:{pageTitle:"Edit Setting",pageDesc:"From here you can edit an existing setting",isNew:!1}})}chaos.config(configBlocks)}(),function(){function PermissionModel(data){data=data||{};var key,fields=arguments.callee.getFields(),length=fields.length;for(key=0;key<length;key++)this[fields[key].data]=data[fields[key].data]||fields[key].value}chaos.value("PermissionModel",PermissionModel),PermissionModel.getRoute=function(){return"permission"},PermissionModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",value:"",title:"Name","class":"col-xs-4"},{data:"Description",value:"",title:"Description","class":"text-wrap",sortable:!1}]}}(),function(){function Anonymous($http,PermissionModel,AbstractRepository){function PermissionRepository(){AbstractRepository.apply(this,arguments.callee.caller.arguments)}return PermissionRepository.prototype=Object.create(AbstractRepository.prototype),PermissionRepository.prototype.constructor=PermissionRepository,new PermissionRepository}chaos.factory("PermissionRepository",Anonymous)}(),function(){function Anonymous($scope,PermissionRepository,AbstractController){function PermissionController(){AbstractController.apply(this,arguments.callee.caller.arguments)}return PermissionController.prototype=Object.create(AbstractController.prototype),PermissionController.prototype.constructor=PermissionController,new PermissionController}chaos.controller("PermissionController",Anonymous)}(),function(){function configBlocks($stateProvider){var route="views/account/permission/";$stateProvider.state("permission",{url:"/permission",templateUrl:"views/common/content-small.html",data:{pageTitle:"Permission"},controller:"PermissionController as ctrl","abstract":!0}).state("permission.index",{url:"",templateUrl:"views/common/simple-grid.html",data:{pageTitle:"Manage Permissions",pageDesc:"From here you can browse all of the latest permissions"}}).state("permission.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@permission.create":{templateUrl:route+"form.html"}},data:{pageTitle:"New Permission",pageDesc:"From here you can create a new permission",isNew:!0}}).state("permission.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@permission.edit":{templateUrl:route+"form.html"}},data:{pageTitle:"Edit Permission",pageDesc:"From here you can edit an existing permission",isNew:!1}})}chaos.config(configBlocks)}(),function(){function RoleModel(data){data=data||{};var key,fields=arguments.callee.getFields(),length=fields.length;for(key=0;key<length;key++)this[fields[key].data]=data[fields[key].data]||fields[key].value}chaos.value("RoleModel",RoleModel),RoleModel.getRoute=function(){return"role"},RoleModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",value:"",title:"Name","class":"col-xs-4"},{data:"Description",value:"",title:"Description","class":"text-wrap",sortable:!1},{data:"Permissions",value:[],visible:!1}]}}(),function(){function Anonymous($http,RoleModel,AbstractRepository){function RoleRepository(){AbstractRepository.apply(this,arguments.callee.caller.arguments)}return RoleRepository.prototype=Object.create(AbstractRepository.prototype),RoleRepository.prototype.constructor=RoleRepository,new RoleRepository}chaos.factory("RoleRepository",Anonymous)}(),function(){function Anonymous($scope,RoleRepository,PermissionRepository,AbstractController){function RoleController(){AbstractController.apply(this,arguments.callee.caller.arguments)}return RoleController.prototype=Object.create(AbstractController.prototype),RoleController.prototype.constructor=RoleController,RoleController.prototype.afterForm=function(){PermissionRepository.index().then(function(response){$scope.permissions=response.data})},RoleController.prototype.toggle=function(mode){switch(mode){case"check":$scope.model.Permissions=$scope.permissions.map(function(item){return item});break;case"uncheck":$scope.model.Permissions=[]}},new RoleController}chaos.controller("RoleController",Anonymous);
}(),function(){function configBlocks($stateProvider){var route="views/account/role/";$stateProvider.state("role",{url:"/role",templateUrl:"views/common/content-small.html",data:{pageTitle:"Role"},"abstract":!0,controller:"RoleController as ctrl"}).state("role.index",{url:"",templateUrl:"views/common/simple-grid.html",data:{pageTitle:"Manage Roles",pageDesc:"From here you can browse all of the latest roles"}}).state("role.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@role.create":{templateUrl:route+"form.html"}},data:{pageTitle:"New Role",pageDesc:"From here you can create a new role",isNew:!0}}).state("role.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@role.edit":{templateUrl:route+"form.html"}},data:{pageTitle:"Edit Role",pageDesc:"From here you can edit an existing role",isNew:!1}})}chaos.config(configBlocks)}(),function(){function UserModel(data){data=data||{};var key,fields=arguments.callee.getFields(),length=fields.length;for(key=0;key<length;key++)this[fields[key].data]=data[fields[key].data]||fields[key].value}chaos.value("UserModel",UserModel),UserModel.getRoute=function(){return"user"},UserModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",value:"",title:"Username"},{data:"Email",value:"",title:"Email"},{data:"Password",value:"",visible:!1},{data:"ForcePasswordChange",value:!0,visible:!1},{data:"Profile",value:"",visible:!1},{data:"Roles",value:[],visible:!1}]}}(),function(){function Anonymous($http,UserModel,AbstractRepository){function UserRepository(){AbstractRepository.apply(this,arguments.callee.caller.arguments)}return UserRepository.prototype=Object.create(AbstractRepository.prototype),UserRepository.prototype.constructor=UserRepository,new UserRepository}chaos.factory("UserRepository",Anonymous)}(),function(){function Anonymous($scope,UserRepository,RoleRepository,AbstractController){function UserController(){AbstractController.apply(this,arguments.callee.caller.arguments)}return UserController.prototype=Object.create(AbstractController.prototype),UserController.prototype.constructor=UserController,UserController.prototype.beforeForm=function(id,isNew){$scope.roles={data:[],primary:{Id:0},secondary:[],filter:function(value){return void 0===_.findWhere([$scope.roles.primary].concat($scope.roles.secondary),{Id:value.Id})}}},UserController.prototype.afterForm=function(id,response,isNew){isNew||(Array.isArray($scope.model.Profile)&&($scope.model.Profile={}),$scope.model.Password=$scope.mistr.Password="******"),RoleRepository.index().then(function(response){$scope.roles.data=response.data;var defaultRole=_.findWhere($scope.roles.data,{Name:"User"}),primaryRole=_.findWhere($scope.model.Roles,{IsPrimary:!0});void 0!==primaryRole?$scope.roles.primary=primaryRole.Role:void 0!==defaultRole&&($scope.roles.primary=defaultRole),_.each(_.without($scope.model.Roles,primaryRole),function(value){$scope.roles.secondary.push(value.Role)})})},UserController.prototype.beforeSave=function(model,id,isNew){model.Roles=[$scope.roles.primary].concat($scope.roles.secondary)},new UserController}chaos.controller("UserController",Anonymous)}(),function(){function configBlocks($stateProvider){var route="views/account/user/";$stateProvider.state("user",{url:"/user",templateUrl:"views/common/content-small.html",data:{pageTitle:"User"},"abstract":!0,controller:"UserController as ctrl"}).state("user.index",{url:"",templateUrl:route+"grid.html",data:{pageTitle:"Manage Users",pageDesc:"From here you can browse all of the latest user accounts"}}).state("user.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@user.create":{templateUrl:route+"form.html"}},data:{pageTitle:"New User",pageDesc:"From here you can create a new user account",isNew:!0}}).state("user.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@user.edit":{templateUrl:route+"form.html"}},data:{pageTitle:"Edit User",pageDesc:"From here you can edit an existing user account",isNew:!1}})}chaos.config(configBlocks)}(),function(){function Anonymous(AbstractModel){function StaffModel(data){StaffModel.parent.constructor.apply(this,[data,StaffModel.getFields()])}return extend(StaffModel,AbstractModel),StaffModel.getRoute=function(){return"staff"},StaffModel.getFields=function(){return[{data:"Id",value:0,visible:!1},{data:"Name",title:"Name",value:"",sortable:!1}]},StaffModel}chaos.service("StaffModel",Anonymous)}(),function(){function Anonymous($http,StaffModel,AbstractRepository){function StaffRepository(){StaffRepository.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(StaffRepository,AbstractRepository),new StaffRepository}chaos.service("StaffRepository",Anonymous)}(),function(){function Anonymous($scope,StaffRepository,AbstractController){function StaffController(){StaffController.parent.constructor.apply(this,arguments.callee.caller.arguments)}return extend(StaffController,AbstractController),new StaffController}chaos.controller("StaffController",Anonymous)}(),function(){function configBlocks($stateProvider){$stateProvider.state("staff",{url:"/staff",templateUrl:"views/common/content-small.html",data:{pageTitle:"Staff"},controller:"StaffController as ctrl","abstract":!0}).state("staff.index",{url:"",templateUrl:"views/common/simple-grid.html",data:{pageTitle:"Manage Staffs",pageDesc:"From here you can browse all of the latest staffs"}}).state("staff.create",{url:"/create",views:{"":{templateUrl:"views/common/simple-form.html"},"@staff.create":{templateUrl:"views/kintai/staff/form.html"}},data:{pageTitle:"New Staff",pageDesc:"From here you can create a new staff",isNew:!0}}).state("staff.edit",{url:"/edit/{id:int}",views:{"":{templateUrl:"views/common/simple-form.html"},"@staff.edit":{templateUrl:"views/kintai/staff/form.html"}},data:{pageTitle:"Edit Staff",pageDesc:"From here you can edit an existing staff",isNew:!1}})}chaos.config(configBlocks)}();