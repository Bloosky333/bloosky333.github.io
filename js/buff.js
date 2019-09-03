Vue.component('buff', {
    props: ['stat', 'depends'],
    methods: {
        decreaseStat(){
            if(this.stat.current > 0) {
                this.stat.current --;
            }
        },
        resetStat(){
            this.stat.current = this.stat.max;
            this.$root._useKi(this.stat.name);
        },
        emptyStat(){
            this.stat.current = 0;
        },
    },
    computed: {
        canRenew(){
            return (!this.depends || this.depends.current > 0) && this.stat.current != this.stat.max;
        },
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="row align-items-center">
                <div class="col-5">
                    <h6 class="text-capitalize m-0">{{ stat.title }}<br/><slot></slot></h6>
                </div>
                <div class="col-7 text-right">
                    <span class="badge buffBadge mr-3" :class="{'badge-success': stat.current > 1, 'badge-warning': stat.current==1, 'badge-danger': !stat.current}">{{ stat.current }}</span>
              
                    <button class="btn btn-success align-top" type="button" @click="resetStat()" :disabled="!canRenew"><i class="fa fa-play"></i></button>
                    <button class="btn btn-secondary align-top" type="button" @click="emptyStat()" :disabled="!stat.current"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});
