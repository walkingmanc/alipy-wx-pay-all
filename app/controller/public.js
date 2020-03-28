//controller/public.js
'use strict';
 
const Controller = require('egg').Controller;
 
class PublicController extends Controller {
    async pay() {

        const { ctx } = this;

         //判断客户端是pc还是手机

        var deviceAgent =    ctx.request.get("user-agent").toLowerCase();
        var  client_type;

        console.log("deviceAgent="+deviceAgent);
        var agentID = deviceAgent.match(/(iphone|ipod|ipad|android)/);
        if(agentID){
            //    请求来自手机、pad等移动端
            client_type=1
        }else{
            //    请求来自PC
            client_type=2
        }            


        const {goods,price,order_id,email,serialno} = ctx.query;
        
          var s=client_type==1?"移动端":"PC端";

        console.log("client_type="+client_type+";请求来自="+s);
           
           

        await this.ctx.render('pcpay',{
            goods,
            price,
            order_id,
            client_type,
            email,
            serialno

        });
    }


    async pcpay() {

        const { ctx } = this;
        const { paytype, qr_url } = ctx.request.body;

        

       
        console.log("paytype="+paytype+"&qr_url="+qr_url);
              


        
           
           

        await this.ctx.render('pc',{
            paytype,
            payname:paytype=="wechat"?"手机微信":"手机支付宝",
            qr_url

        });
    }

}
 
module.exports = PublicController;