

$(document).ready(function(){
//initForm();
	 
 });
 
 function initForm()
 {
 	laydate.render({
elem: '#seldate', //指定元素
min: 0,
max: 2,
done: cfNoInit
}); //执行一个日历laydate实例

// 	  $.ajax({
//              type: "POST",//方法类型
//              url: "http://192.168.1.196:9090//outerApi/loadBoardPage?order_id="+getCookie("order_id"),//url
//              timeout : 1000, 
//              contentType: "application/x-www-form-urlencoded",
//              async: false,
//              success: function (r) {
//              	var result = eval( '(' + r + ')' );                              
//                  if (result["rspCode"] == "DC00000") {                     	                        
//                      form1.cfType.value = result["board_type"]; 
//                      form1.cfCount.value = result["order_people_number"]; 
//                      form1.cfDate.value = result["order_board_date"]; 
//                      form1.cfTime.value = result["order_board_time_interval"]; 
//                      form1.cfNo.options.add(new Option(result["board_id"]+"号",result["board_id"])); 
//                      form1.cfNo.value = result["board_id"];
//                }
////                  else
////                    parent.sweetAlert("提示",result["rspMsg"],"warning");
//              },
//            error : function() {
//                  parent.sweetAlert("系统错误","加载餐桌失败！","warning");
//              }
//          });
    //引入选择框样式，初始化
   $("#cfCount").selectOrDie({
        onChange: cfNoInit  //选择框值改变时执行 
    });
   $("#cfTime").selectOrDie({
        onChange: cfNoInit
    });
   $("#cfNo").selectOrDie();
   
   md_sele(); //桌号选择框的mousedown事件
   $('input').change(cfNoInit); //  input值改变时执行              
 }
 
//桌号选择框初始化 ，清除之前的选中值
function cfNoInit()
{
   $("#cfNo").empty();
   $("#cfNo").get(0).options.add(new Option("请选择用餐桌号",""));
   $("div.sod_list").eq(2).empty();
   $("div.sod_list").eq(2).append('<ul><li class="selected active" title="请选择用餐桌号" data-value="">请选择用餐桌号</li></ul>');
   $("div.sod_label").eq(2).html('请选择用餐桌号');
   
}

//点击桌号选择框时请求获取可用的桌号列表
function md_sele()
{
  $("div.sod_select").eq(2).on("mousedown", function(){
  	   if(form1.cfNo.options.length>1)
  	     return;
  	   if(form1.cfType.value=="")
  	   {
  	   	parent.sweetAlert("提示","请选择中西餐厅！","warning");
  	   	return ;
  	   }
  	   if(form1.cfCount.value==""||form1.cfCount.value==null)
  	   {
  	   	parent.sweetAlert("提示","请写入用餐人数！","warning");
  	   	return ;
  	   }
  	    if(form1.cfDate.value==""||form1.cfDate.value==null)
  	   {
  	   	parent.sweetAlert("提示","请选择用餐日期！","warning");
  	   	return ;
  	   }
  	   if(form1.cfTime.value==""||form1.cfTime.value==null)
  	   {
  	   	parent.sweetAlert("提示","请选择用餐时段！","warning");
  	   	return ;
  	   }  	 
  	   var cfType=form1.cfType.value,cfCount=form1.cfCount.value,
  	       cfDate=form1.cfDate.value,cfTime=form1.cfTime.value;
  	   var user_id=getCookie("user_id");
  	   var u="http://192.168.1.196:9090//outerApi/getAvailableBoard?order_board_date="
        	+cfDate+"&order_board_time_interval="+cfTime+"&user_id="+user_id
        	+"&board_type="+cfType+"&order_people_number="+cfCount;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url  
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    console.log(r);//打印服务端返回的数据(调试用)
                    if (result["rspCode"] == "DC00000") {                     	 
                         var b=eval(result["board_id_set"]); 
                         $("div.sod_list").eq(2).empty();   
                         var strHtml='<ul style="max-height:160px;"><li class="selected active" title="请选择用餐桌号" data-value="">请选择用餐桌号</li>';
                         for (var i=0;i<b.length;i++)
                         {
                           form1.cfNo.options.add(new Option(b[i]+"号",b[i])); 
                           strHtml+='<li class="" title="'+b[i]+"号"+'" data-value="'+b[i]+'">'+b[i]+"号"+'</li>';                           
                         }
                         strHtml+='</ul>';
                         $("div.sod_list").eq(2).append(strHtml);
                    }else
                      parent.sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                    sweetAlert("系统错误","加载桌号失败！", "warning");
                }
            });       
  }); 
}

//提交选桌信息
function submitForm()
{
	if(form1.cfType.value=="")
  	   {
  	   	parent.sweetAlert("提示","请选择中西餐厅！","warning");
  	   	return ;
  	   }
  	   if(form1.cfCount.value==""||form1.cfCount.value==null)
  	   {
  	   	parent.sweetAlert("提示","请写入用餐人数！","warning");
  	   	return ;
  	   }
  	    if(form1.cfDate.value==""||form1.cfDate.value==null)
  	   {
  	   	parent.sweetAlert("提示","请选择用餐日期！","warning");
  	   	return ;
  	   }
  	   if(form1.cfTime.value==""||form1.cfTime.value==null)
  	   {
  	   	parent.sweetAlert("提示","请选择用餐时段！","warning");
  	   	return ;
  	   } 
  	   if(form1.cfNo.value==""||form1.cfNo.value==null)
  	   {
  	   	parent.sweetAlert("提示","请选择桌号！","warning");
  	   	return ;
  	   } 
  	   var cfDate=form1.cfDate.value,cfTime=form1.cfTime.value,
  	       cfNo=form1.cfNo.value,userid=getCookie("user_id");
  	   var order_id=getCookie("order_id");
  	    if(order_id==""||order_id==null)
  	   {
  	   	parent.sweetAlert("提示","订单不存在！","warning");
  	   	return ;
  	   }  
  	   var u="http://192.168.1.196:9090//outerApi/reserveBoard?order_board_date="
        	+cfDate+"&order_board_time_interval="+cfTime
        	+"&board_id="+cfNo+"&user_id="+userid+"&order_id="+order_id;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url  
                timeout : 1000, 
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                                      
                    if (result["rspCode"] == "DC00000") 
                    {
                     delCookie("order_id");	
                     var s="本次获得积分："+result["accumulate_points"]+"。";
                     if(result["vip"] == 1)
                       s+="恭喜成为我们尊贵的VIP会员！";                      
                       parent.swal({ 
                     title: "支付成功！", 
                     type: "success",
                     text: s,                
                   },function(){ parent.window.location.href='index.html'; });                    
                    }else if (result["rspCode"] == "DC00020") 
                    {
                     parent.swal({ 
                     title: "余额不足！", 
                     type: "warning",
                     text: "请先充值",                
                   },function(){ parent.window.location.href='usr_info.html'; });	
                    }
                },
              error : function() {
                   parent.sweetAlert("系统错误","提交选桌失败！", "warning");
                }
            });
	
}