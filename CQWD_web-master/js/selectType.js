 $(document).ready(function(){
	//请求获取菜系列表
  $.ajax({
                type: "POST",//方法类型
                url: "http://192.168.1.196:9090//outerApi/getAllFoodType",//url  
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                              
                    if (result["rspCode"] == "DC00000") {                     	 
                       var fs=eval(result["food_type"]);                   
                       for (var i=0;i<fs.length;i++)
                       {
                       	var f=eval(fs[i]);
                       	addType(f.food_id,f.food_name);    
                       }                                           
                    }else
                      parent.sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                     sweetAlert("系统错误","加载菜系失败！", "warning");
                }
            });
         
 });
 
 //添加菜系
 function addType(id,name)
 {
 	$("#caixi").append('<dd><a onclick="selectType('+id
 	+')" ><img src="img/point.png" />'+name+'</a></dd>');	
 }
 
 //选中菜系后跳转页面
 function selectType(type)
 {
 	parent.location.href='caipin.html?type='+type; 
 }