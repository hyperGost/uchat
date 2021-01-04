import MyCom from './MyCom.vue'
function install(Vue){
    Vue.prototype.$myToast=myToast;
    function myToast(text){
        let vm=new Vue({
            render(h){
                return h(MyCom,{
                    props:{
                    message:text
                }
            })
            }
        }).$mount();
        let dom=vm.$el;
        document.body.appendChild(dom);
        setTimeout(()=>{
            dom.className='trans'
        },0)  
        setTimeout(()=>{
            dom.style.opacity=0;
        },1000)
        setTimeout(()=>{
            document.body.removeChild(dom)
        },1200)
    }
}
export default {install};
