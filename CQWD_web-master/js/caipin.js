 onload=function(){  
        var e=document.getElementById("refreshed");  
        if(e.value=="no")e.value="yes";  
        else{e.value="no";location.reload();}  
  }  
 
 $(document).ready(function(){
 	login();
   	var user_id=getCookie("user_id");
    if(user_id==null || user_id=="")
       $("#username").text("请登录"); 
    else
       $("#username").text(getCookie("user_name"));
            
   	 $("#pageIndex").val(1);
   	 var firstId;
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
                       $("#caixi").empty();
                      
                       for (var i=0;i<fs.length;i++)
                       {
                       	var f=eval(fs[i]);
                       	addType(f.food_id,f.food_name);
                       	if(i==0)
                       	 firstId=f.food_id;
                       }
                       $("#caixi").selectOrDie();
                                           
                    }else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","加载菜系失败！","warning");
                }
            });
      var type=getParams("type");
      if(type!=null)
       selectType(type,1,1);
      else
       selectType(firstId,1,1);
         
     });
     
   
  function isLogin()
  {
  	 var user_id=getCookie("user_id");
     if(user_id==null || user_id=="")
         window.location.href="login.html"; 
  }
  //用户注销
  function logout()
  {
  	var user_id=getCookie("user_id"),order_id=getCookie("order_id");
  	if(user_id==null || user_id=="" )
      return;
    var u="http://192.168.1.196:9090//outerApi/cancellation?user_id="+user_id;  
  	if(order_id!=null && order_id!="")
       u+="&order_id="+order_id; 
  	$.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                              
                    if (result["rspCode"] == "DC00000") {  
                      delCookie("order_id");
                      delCookie("user_id");
                      delCookie("user_name");
                      delCookie("user_password");
                      delCookie("member_level");
                      delCookie("user_phone");
                      window.location.href='login.html';                                         
                    }else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","注销失败！","warning");
                }
            });       	
   }
   //个人中心入口     
   function info()
   {
      window.location.href='usr_info.html';
   } 
  
 //加载分页的第page页
  function loadN(page)
 {
 	var index=Number($("#pageIndex").val());
 	var type=$("#caixi").val();
 	selectType(type,page,index);
 	
 }
 //加载分页的上一页
 function loadPre()
 {
 	var index=Number($("#pageIndex").val());
 	var pre=index-1;
 	if(pre<1)
 	  return;
 	var type=$("#caixi").val();
 	selectType(type,pre,index);
 	
 }
  //加载分页的下一页
  function loadNext()
 {
 	 var index=Number($("#pageIndex").val());
 	 var max=Number($("#maxPage").val());
 	 var next=index+1; 
   	 if(next==max)
   	 { 
   	 	max++;
   	 	var child1=document.getElementById('a'+(max-5));
        child1.parentNode.removeChild(child1);
        
        var child1=document.getElementById('aNext');
        child1.parentNode.removeChild(child1);
        
   	    var l1=document.createElement("li");
   	    l1.innerHTML='<a id="a'+max+'" onclick="loadN('+max+')" >'+max+'</a>';
   	    document.getElementById("pag").appendChild(l1);
   	    
   	    var l2=document.createElement("li");
   	    l2.innerHTML='<a id="aNext" onclick="loadNext()" >»</a>';
   	    document.getElementById("pag").appendChild(l2);
   	 }
 	 var type=$("#caixi").val();
 	 selectType(type,next,index);	  		
 }
 
 //分页改变后ui的调整
 function PageChange(index,next)
 {
   	if(index<1||next<1)
   	  return;
   	 document.getElementById('a'+index).setAttribute("class", ""); 
   	 document.getElementById('a'+next).setAttribute("class", "active"); 
   	 $("#pageIndex").val(next); 
 }
 
 //选择框中添加菜系
 function addType(id,name)
 { 
 	$("#caixi").append('<option  value="'+id+'">'+name+'</option>');
   	//form1.caixi.options.add(new Option(name,id));
   	if(getParams("type")==id)
   	{
   	  $("#caixi").val(id);	
   	} 	
 }
 
 //选中菜系后请求新的菜品列表
  function sele_Change(){
    var objS = form1.caixi;
    var type = objS.options[objS.selectedIndex].value;
    var index=Number($("#pageIndex").val());
    selectType(type,1,index);
  }
  
 //列表中添加菜品
  function addFood(food,num)
 {
 	$("#cfFood").append('<div class="food"><img src="'+food["food_img"]+'?imageView2/1/w/150/h/150'+'" /><ul><li><strong>菜名</strong>&nbsp;'
 	+food["food_name"]+'</li>'
 	//+'<li><strong>月销</strong>&emsp;'+food["food_monthlysales"]+'</li>'
 	+'<li><strong>价格</strong>&emsp;'
 	+food["food_price"]+'</li><li><strong>会员价格</strong>&emsp;'+food["food_vip_price"]+'</li><li><div class="one"><strong>介绍</strong>&emsp;' 	
	+food["food_remark"]
	+'</div></li></ul><div><button class="btn-remove" onclick="removeF('+food["food_id"]+')"></button><span id="'+'foodSum'+food["food_id"]+'">'+num+'</span><button class="btn-add" onclick="addF('+food["food_id"]+')"></button></div></div>');
 }
 
 //菜品数目+1
 function addF(id)
 {
 	var sp=document.getElementById('foodSum'+id); 
 	var count=Number(sp.innerText)+1; 
 	if(count>21)
 	  return;
 	sp.innerText=count;
 	submitF(id,count);	
 }
 
 //菜品数目-1
  function removeF(id)
 {
 	var sp=document.getElementById('foodSum'+id); 
 	var count=Number(sp.innerText)-1; 
 	if(count<0)
 	  return;
 	sp.innerText=count;
 	submitF(id,count);
 }
 
 //更新数目改变后的菜品
  function submitF(id,count)
  {
  	var user_id=getCookie("user_id"),order_id=getCookie("order_id");
    if(user_id==null || user_id=="" )
    {
    	swal({ 
               title: "客官，您还没登录", 
               type: "warning",
               text: "先去登录吧!",                
               },function(){
                  window.location.href="login.html"; 
       });
       return;
    }
                
    var u="http://192.168.1.196:9090//outerApi/addFood?food_id="
                +id+"&food_num="+count ;          
  	if(order_id!=null && order_id!="")
       u+="&order_id="+order_id; 
  	$.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    if (result["rspCode"] == "DC00000") { 
                    	if(result["order_id"]!=null)
                    	 SetCookie("order_id",result["order_id"]);                   	  
                    }
                    else
                       sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","更新数目失败！","warning");
                }
            });
  }
 
 //请求菜品列表
 function selectType(type,page,index)//菜系，请求页数，当前页数
 {
 	var order_id=getCookie("order_id");
    var u="http://192.168.1.196:9090//outerApi/getFoodByType?food_type_id="
                +type+"&food_page="+page;
  	if(order_id!=null && order_id!="")
       u+="&order_id="+getCookie("order_id");  	
 	$.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    //console.log(r);//打印服务端返回的数据(调试用)
                    if (result["rspCode"] == "DC00000") {  
                    	$("#cfFood").empty();
                    	var foods=eval( '(' + result["food_all"] + ')' );
                    	var num=eval( '(' + result["food_num"] + ')' ); 
                    	for(var i=0;i<foods.length;i++)    
                    	  addFood(foods[i],Number(num[i]));                     	   
                    	PageChange(index,page);  
                    	  
                    }else if (result["rspCode"] == "DC00011")
                    {
                    	sweetAlert("提示","没有更多菜品了，客官!","warning");                    	
                    }else if (result["rspCode"] == "DC00013")
                    {
                     delCookie("order_id");	
                    	 swal({ 
                     title: "订单已过期", 
                     type: "warning",
                     text: "请重新订桌下单!",                
                      },function(){
                      	selectType(type,page,index); 
                      });                    	
                  }
                    else if (result["rspCode"] == "DC00022")
                    {
                    delCookie("order_id");	
                    	 swal({ 
                     title: "订单已支付", 
                     type: "warning",
                     text: "可以重新下单!",                
                      },function(){
                      	selectType(type,page,index); 
                      });                    	
                    } else if (result["rspCode"] == "DC00023")
                    {
                    delCookie("order_id");	
                    	 swal({ 
                     title: "订单不存在", 
                     type: "warning",
                     text: "请重新下单!",                
                      },function(){
                      	selectType(type,page,index); 
                      });                    	
                    }                    
                    else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    parent.sweetAlert("系统错误","加载菜品失败！","warning");
                }
            });
 }
 
 //获取url中的参数
function getParams(key) {
            var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            console.log("null");
            return null;
 };
 
//用户登录
         function login() {
        	var tel=getCookie("user_phone");
        	var pwd = getCookie("user_password");
        	var u="http://192.168.1.196:9090//outerApi/login?user_phone="
        	+tel+"&user_password="+pwd;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url           
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    //console.log(r);//打印服务端返回的数据(调试用)
                    if (result["rspCode"] == "DC00000") {                             
                     SetCookie("user_id",result["user_id"]);
                     SetCookie("user_name",result["user_name"]);  
                     SetCookie("user_password",pwd); 
                     SetCookie("user_phone",tel); 
                     SetCookie("member_level",result["member_level"]); 
                    }else
                       window.location.href='login.html'; 
                },
              error : function() {
                    sweetAlert("系统错误","用户登录失败！", "warning");
                }
            });
         }