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
            <div class="row align-items-center">
                <div class="col-5 pt-2">
                    <h6 class="text-capitalize">{{ stat.title }}</h6>
                </div>
                <div class="col-7 col-flex" v-if="!lvl_mult">
                    <input type="text" class="form-control text-center" v-model="stat.max">
                    <button class="btn btn-success" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                    <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                </div>
                <div class="col-7 pt-2 text-right" v-if="lvl_mult">
                    <h6>{{ this.stat.max }}</h6>
                </div>
            </div>
        </div>
    </div>
  `
});
