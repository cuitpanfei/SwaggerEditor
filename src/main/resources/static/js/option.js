layui.use([ 'element' ], function() {
	var element = layui.element;
	element.render();
});
function addTag(buttonElement) {
	layui.use([ 'swagger' ], function() {
		var swagger = layui.swagger;
		swagger.addTag(buttonElement);
	});
}
function delTag(buttonElement) {
	layui.use([ 'swagger' ], function() {
		var swagger = layui.swagger;
		swagger.delTag(buttonElement);
	});
}
function addInterface(buttonElement) {
	layui.use([ 'swagger' ], function() {
		var swagger = layui.swagger;
		swagger.addInterface(buttonElement);
	});
}
function editInterface(method,name){
	layui.use(['jquery'],function(){
		var $ = layui.$;
		var collaItemId="#interface-"+method+"-"+md5(name)+"-pane"
		var interfaceBodyClass=" .interface-body";
		var interface_body=($(collaItemId+interfaceBodyClass))[0];
		layui.each($(collaItemId).find("div[isEditor='false']"),function(index,item){
			item.setAttribute('isEditor',true);
		});
		layui.each($(interface_body).find('div[caneditor]'),function(index,item){
			item.setAttribute('contenteditable',true);
		});
	});
	
}
function modifiedInterface(method,name){
	layui.use(['jquery'],function(){
		var $ = layui.$;
		var collaItemId="#interface-"+method+"-"+md5(name)+"-pane"
		var interfaceBodyClass=" .interface-body";
		var interface_body=$(collaItemId+interfaceBodyClass)[0];
		layui.each($(collaItemId).find("div[isEditor='true']"),function(index,item){
			item.setAttribute('isEditor',false);
		});
		layui.each($(interface_body).find('div[caneditor]'),function(index,item){
			item.setAttribute('contenteditable',false);
		});
	});
}
function delInterface(buttonElement) {
	layui.use([ 'swagger' ], function() {
		var swagger = layui.swagger;
		swagger.delInterface(buttonElement);
	});
}
function addParameter(buttonElement,method,name){
	layui.use([ 'swagger','jquery','table' ], function() {
		var swagger = layui.swagger;
		var table = layui.table;
		var $ = layui.$;
		var tableId= method+"-"+md5(name)+"-table";
		var parametersRow = $(buttonElement.parentNode).find('table[lay-filter="paramter_table"]')[0];
		var parameter = document.createElement("div");
		parameter.setAttribute("class", "layui-col-xs12 layui-col-sm12 layui-col-md12 parameter");
		parametersRow.appendChild(parameter);
		table.render();
	});
}