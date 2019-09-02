Vue.component('status-bar', {
    props: ['hp', 'ki'],
    data(){
        let data = {
            show_notif: false,
            ki_change: 0,
        };

        return data;
    },
    created(){
        this.hideNotif = _.debounce(this._hideNotif, 2000);
    },
    methods: {
        _hideNotif(){
            this.show_notif = false;
            this.ki_change = 0;
        },
    },
    computed: {
        hp_percent_string(){
            return (Math.round(this.hp.current/this.hp.max*100)) + '%';
        },
        hp_status_string(){
            return this.hp.current + "/" + this.hp.max;
        },
        ki_percent_string(){
            return (Math.round(this.ki.current/this.ki.max*100)) + '%';
        },
        ki_status_string(){
            return this.ki.current + "/" + this.ki.max;
        },
        ki_change_string(){
            return this.ki_change > 0 ? '+' + this.ki_change : this.ki_change;
        }
    },
    watch: {
        'ki.current'(newVal, oldVal){
            this.ki_change += newVal - oldVal;
            this.show_notif = true;
            this.hideNotif();
        },
    },
    template: `
    <div class="statusBar bg-dark">
        <div class="row">
            <div class="col-6 d-flex">
                <div class="circle text-white bg-success"><i class="fa fa-heart fa-lg"></i></div>
                <div class="flex-grow-1 bar">
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar" :style="{width: hp_percent_string}"></div>
                        <div class="progress-text">{{ hp_status_string }}</div>
                    </div>
                </div>
            </div>
            <div class="col-6 d-flex">
                <div class="circle text-white bg-primary"><i class="fa fa-bolt fa-lg"></i></div>
                <div class="flex-grow-1 bar">
                    <div class="progress">
                        <div class="progress-bar bg-primary" role="progressbar" :style="{width: ki_percent_string}"></div>
                        <div class="progress-text">{{ ki_status_string }}</div>
                    </div>
                    <transition name="ki-change-notif" enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutDown">
                        <div class="popover bs-popover-bottom bg-secondary" :class="{'bg-danger': ki_change<0, 'bg-success': ki_change>0}" v-if="show_notif" :style="{left: 'calc('+ki_percent_string+' - 20px)'}">
                            <div class="popover-body text-white">{{ ki_change_string }}</div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
  `
});
