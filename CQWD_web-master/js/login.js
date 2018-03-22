 onload=function(){  
        var e=document.getElementById("refreshed");  
        if(e.value=="no")e.value="yes";  
        else{e.value="no";location.reload();}  
  } 

//跳转到注册页面
	 function register()
	 {
	 	 window.location.href='register.html';  
	 }
	    //登录请求
        function login() {
        	if(form1.tel.value==""||form1.password.value=="")
        	{
        	  sweetAlert("提示","输入不能为空！","warning");
        	  return;
        	}
        	var tel=form1.tel.value;
        	if(!isPoneAvailable(tel))
        	{
        	  sweetAlert("提示","手机号无效！","warning");
        	  return;
        	}
        	var pwd = hex_sha1(form1.password.value);
        	var u="http://192.168.1.196:9090//outerApi/login?user_phone="
        	+tel+"&user_password="+pwd;
            $.ajax({
                type: "POST",//方法类型
                url: u,//url
                timeout : 1000,                        
                contentType: "application/x-www-form-urlencoded",
                async: false,
                success: function (r) {
                	var result = eval( '(' + r + ')' );                
                    if (result["rspCode"] == "DC00000") {
                     swal({ 
                     title: "登录成功！", 
                     type: "success",
                     text: "正在进入主页。", 
                     timer: 1000, 
                     confirmButtonColor: "#FFFFFF",                
                   });  
                   //保存登录信息
                     SetCookie("user_id",result["user_id"]);
                     SetCookie("user_name",result["user_name"]);  
                     SetCookie("user_password",pwd); 
                     SetCookie("user_phone",tel); 
                     SetCookie("member_level",result["member_level"]);
                     if(result["order_id"]!=null)
                        SetCookie("order_id",result["order_id"]);
                     setTimeout('window.location.href="index.html";',1000);                         
                    }else
                      sweetAlert("提示",result["rspMsg"],"warning");
                },
              error : function() {
                     sweetAlert("系统错误","用户登录失败！", "warning");
                }
            });
        
        }
       //手机号正则表达式验证  
       function isPoneAvailable(str) {  
          var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
          if (!myreg.test(str)) {  
              return false;  
          } else {  
              return true;  
          }  
      } 