Vue.component('stat-setting', {
    props: ['stat', 'lvl', 'lvl_mult'],
    methods: {
        decreaseStat(){
            if(this.stat.max > 0) {
                this.stat.max --;
            }
        },
        increaseStat(){
            this.stat.max ++;
        },
        _computeStat(){
            this.stat.max = this.lvl * parseFloat(this.lvl_mult);
        }
    },
    created(){
        if(this.lvl_mult) {
            if(this.stat.max == 0) this._computeStat();
            this.computeStat = _.debounce(this._computeStat, 500);
            this.$watch('lvl', this.computeStat);
        }
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="d-flex align-items-center">
                <h6 class="text-capitalize m-0 mr-auto">{{ stat.title }}</h6>
                <div v-if="!lvl_mult">
                    <input type="text" class="form-control text-center w-70-px d-inline-block" v-model="stat.max">
                    <button class="btn btn-success" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                    <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                </div>
                <h6 class="m-0" v-if="lvl_mult">{{ this.stat.max }}</h6>
            </div>
        </div>
    </div>
  `
});
