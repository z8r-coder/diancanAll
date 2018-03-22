 onload=function(){  
        var e=document.getElementById("refreshed");  
        if(e.value=="no")e.value="yes";  
        else{e.value="no";window.location.reload();}  
  }  

$(document).ready(function(){
	      $("#selectTable").hide();
	 	 //优惠券选择框初始化
	 	  $("#Coupon").selectOrDie();
	 	  login();
	 	  //保证user_id存在
          var user_id=getCookie("user_id");
          if(user_id==null || user_id=="")
            window.location.href="login.html"; 
          else
            $("#username").text(getCookie("user_name"));
            
          initList();
          md_sele(); //选择框的mousedown事件
          $("#Coupon").change(useCoupon); //选中值改变时触发
        });
        
        //隐藏选桌，显示选择菜系
        function showTable(t){ 
        	t=t*1000;
        	 $("#jt").animate({
                left:"+=520px"  
            },t);
            $("#selectTable").show();
             $("#orderlist").animate({          	
                opacity:0 
            },t);
            $("#selectTable").animate({
            	top:"-=400px",
                opacity:1,
                
            },t);
          //  setTimeout('$("#orderlist").hide();',t);                        
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

//请求获取优惠券列表
function md_sele()
{
  $("div.sod_select").eq(0).on("mousedown", function(){
  	   if($("#Coupon").get(0).options.length>1)
  	     return;
  	   var user_id=getCookie("user_id");
  	   var order_id=getCookie("order_id");
  	   if(user_id==null || order_id==null)
  	     return;  	  
  	   var u="http://192.168.1.196:9090//outerApi/getCouponList?user_id="
        	+user_id+"&order_id="+order_id;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url  
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    if (result["rspCode"] == "DC00000") {                     	 
                       var b=eval(result["coupon_List"]); 
                       $("#Coupon").empty(); 
                       $("#Coupon").append('<option value="">不使用</option>'); 
                       $("div.sod_list").eq(0).empty();   
                       var strHtml='<ul style="max-height:160px;"><li class="selected active" title="不使用" data-value="">不使用</li>';
                       for (var i=0;i<b.length;i++)
                       {
                         var c=b[i]; 	
                         $("#Coupon").append('<option value="'+c["couponId"]+'">'+c["remark"]+'</option>');                   
                         strHtml+='<li class="" title="'+c["remark"]+'" data-value="'+c["couponId"]+'">'+c["remark"]+'</li>';                           
                      }
                       strHtml+='</ul>';
                       $("div.sod_list").eq(0).append(strHtml);                                                  
                    }else if (result["rspCode"] == "DC00014") 
                    {                    	
                    }
                    else
                      parent.sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    parent.sweetAlert("系统错误","加载优惠券失败！","warning");
                }
            });       
  }); 
}
 
 //获取使用优惠券后的总价
 function useCoupon()
 {
 	if($("#Coupon").val()=="")
 	{
 	  $("#totalm").text($("#summ").text());
 	  return;
 	} 	  
 	$.ajax({
                type: "POST",//方法类型
                url: "http://192.168.1.196:9090//outerApi/useCoupon?order_id="+getCookie("order_id")
                +"&coupon_id="+$("#Coupon").val(),//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    if (result["rspCode"] == "DC00000") {  
                    	$("#totalm").text(result["coupon_Amt"]);                   	  
                    }
                    else
                       sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","使用优惠券失败！","warning");
                }
   });
 }

 //列表中添加菜品 
 function addFood(food)
 {
 	
 	$("#tbody-list").append('<tr height="40"><td align="center" width="20%">'+food["foodName"]+'</td><td align="center" width="20%">￥'
 	+food["price"].toFixed(1)+'</td><td align="center" width="20%"><button class="btn-remove" onclick="removeF('+food["foodId"]+')"></button><span id="'
 	+'foodSum'+food["foodId"]+'">'+food["num"]+'</span><button class="btn-add" onclick="addF('+food["foodId"]+')"></button></td><td align="center" width="20%"><span id="'
 	+'foodtotal'+food["foodId"]+'">'+food["total"].toFixed(1)+'</span></td></tr>');
 }
 
 //列表中菜品数目加1
 function addF(id)
 {
 	var sp=document.getElementById('foodSum'+id); 
 	var count=Number(sp.innerText)+1; 
 	if(count>21)
 	  return;
 	sp.innerText=count;
 	submitF(id,count);	
 }
 
  //列表中菜品数目-1
  function removeF(id)
 {
 	var sp=document.getElementById('foodSum'+id); 
 	var count=Number(sp.innerText)-1; 
 	if(count<0)
 	  return;
 	sp.innerText=count;
 	submitF(id,count);
 	if(count==0)
 	 sp.parentNode.parentNode.remove(); 
 }
 
  //提交更新数目改变的菜品
  function submitF(id,count)
  {
  	var u="http://192.168.1.196:9090//outerApi/shoppingCartAddMinus?food_id="
                +id+"&food_num="+count+"&order_id="+getCookie("order_id");
    var coupon_id=$("#Coupon option:selected").val();            
    if(coupon_id!="")
       u+="&coupon_id="+coupon_id;
  	$.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    //console.log(r);//打印服务端返回的数据(调试用)
                    if (result["rspCode"] == "DC00000"||result["rspCode"] == "DC00018") 
                    {
                    	//sweetAlert("提示",result["rspMsg"],"warning"); 
                    document.getElementById('foodtotal'+id).innerText
                      =result["mod_food_single_sum"];
                   $("#summ").text(result["food_sum_money"]);
                   $("#vipm").text(result["vip_food_money"]); 
                   $("#totalm").text(result["total_food_money"]);    
                    }else if (result["rspCode"] == "DC00019")
                    {
                    	 swal({ 
                     title: "客官还没选菜呢", 
                     type: "warning",
                     text: "先去点菜吧！",                
                      },function(){
                      	window.location.href='index.html'; 
                      });                    	
                    } 
                    else
                       sweetAlert("提示",result["rspMsg"],"warning");
                    if (result["rspCode"] == "DC00018")
                    {
                    	 sweetAlert("提示",result["rspMsg"],"warning");
                    	 $("#Coupon").val("");
                    }
                   
                },
              error : function() {
                    sweetAlert("系统错误","更新数目失败！","warning");
                }
            });
  }
 
 //请求加载菜品列表
 function initList()
 {
 	$('input:radio[name="cType"]').get(0).checked=true; 
 	$.ajax({
                type: "POST",//方法类型
                url: "http://192.168.1.196:9090//outerApi/shoppingCart?order_id="
              +getCookie("order_id")+"&user_id="+getCookie("user_id"),//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                              
                    if (result["rspCode"] == "DC00000") {                     	 
                       $("#tbody-list").empty();
                       var foods=eval( '(' + result["pay_food_all"] + ')' );
                       for(var i=0;i<foods.length;i++)    
                    	  addFood(foods[i]); 
                    	if(result["is_vip_user"]==0) 
                    	{
                    	   $("#vipdd").hide();
                    	   $("div.sod_select").eq(0)
                    	    .removeClass("disabled");//优惠券选择框置为可用
                    	   $("#Coupon").removeAttr("disabled");
                    	   $('input:radio[name="cType"]').get(1).checked=true; 
                    	}               	
                    	$("#summ").text(result["food_sum_money"]);
                    	$("#vipm").text(result["vip_food_money"]); 
                    	$("#totalm").text(result["total_food_money"]);                                            
                    }else if (result["rspCode"] == "DC00013")
                    {
                     delCookie("order_id");	
                    	 swal({ 
                     title: "订单已过期", 
                     type: "warning",
                     text: "请重新下单!",                
                      },function(){
                      	window.location.href='index.html'; 
                      });                    	
                    }else if (result["rspCode"] == "DC00019")
                    {
                    	 swal({ 
                     title: "客官还没选菜呢", 
                     type: "warning",
                     text: "先去点菜吧！",                
                      },function(){
                      	window.location.href='index.html'; 
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
                      	window.location.href='index.html'; 
                      });                    	
                    }else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","加载菜品失败！","warning");
                }
     });	
 }
 
 
 $('input:radio[name="cType"]').change( function(){
 	if(this.value==1) //优惠券优惠方式
 	{
 	  $("div.sod_select").eq(0).removeClass("disabled");//优惠券选择框置为可用	
 	  $("#Coupon").removeAttr("disabled");
 	  $("#totalm").text($("#summ").text()); 
 	}	 
 	else //vip优惠方式
 	{
 	  $("div.sod_select").eq(0).addClass("disabled");//优惠券选择框置为不可用	
 	  $("#Coupon").attr("disabled","disabled");	
 	  $("#Coupon").val("");
 	  $("div.sod_label").eq(0).text("不使用");
 	  $("#totalm").text($("#vipm").text());  
 	} 	  
 });

//提交订单
function checkOut()
{
 var u="http://192.168.1.196:9090//outerApi/checkOut?order_id="+getCookie("order_id");
    var coupon_id=$("#Coupon option:selected").val();            
    if(coupon_id!="")
       u+="&coupon_id="+coupon_id;
  	$.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r){
                	var result = eval( '(' + r + ')' );                
//                  if (result["rspCode"] == "DC00000") 
//                  {
//                   delCookie("order_id");	
//                   var s="本次获得积分："+result["accumulate_points"]+"。";
//                   if(result["vip"] == 1)
//                     s+="恭喜成为我们尊贵的VIP会员！";                      
//                    swal({ 
//                   title: "支付成功！", 
//                   type: "success",
//                   text: s,                
//                 },function(){window.location.href='index.html'; });
//                   
//                  }else if (result["rspCode"] == "DC00020") 
//                  {
//                   swal({ 
//                   title: "余额不足！", 
//                   type: "warning",
//                   text: "请先充值",                
//                 },function(){window.location.href='usr_info.html'; });	
//                  }
                    if (result["rspCode"] == "DC00000") 
                    {
                      showTable(2);
                      FrameTable.window.initForm();
                    }
                      
                    else
                       sweetAlert("提示",result["rspMsg"],"warning");                   
                },
              error : function() {
                    sweetAlert("系统错误","提交订单失败！","warning");
                }
            });	
}

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