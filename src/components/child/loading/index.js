import LoadingComponent from "./Loading";

const Loading = {};

Loading.install = function (Vue) {
  const LoadingConstructor = Vue.extend(LoadingComponent);
  const instance = new LoadingConstructor();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);

  instance.show = false;

  if(!Vue.$loading){
    Vue.$loading = {
      show(options = {}){
        instance.show = true;
        if(options){
          instance.text = options.text;
        }
      },
      hide(){
        instance.show = false;
      }
    }
  }
}

export default Loading;
