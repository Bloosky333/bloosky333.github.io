Vue.component('stat', {
    props: ['stat'],
    methods: {
        decreaseStat(){
            if(this.stat.current > 0) {
                this.stat.current -= this.stat.mod;
                this.stat.mod = 1;
            }
        },
        increaseStat(){
            if(this.stat.current < this.stat.max) {
                this.stat.current += this.stat.mod;
                this.stat.mod = 1;
            }
        },
        resetStat(){
            this.stat.current = this.stat.max;
        },
        emptyStat(){
            this.stat.current = 0;
        },
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="row align-items-center">
                <div class="col-6 col-md-3 pt-2 mb-2 mb-md-0">
                    <h6 class="text-capitalize">{{ stat.title }}</h6>
                </div>
                <div class="col-6 col-md-3 mb-2 mb-md-0">
                    <div class="input-group">
                        <input type="text" class="form-control text-center" v-model="stat.current" :class="{'text-danger': !stat.current}">
                        <div class="input-group-append">
                            <span class="input-group-text input-group-text-fixed-w-sm">/ {{ stat.max }}</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 text-right col-flex">
                    <select class="custom-select w-auto" v-model="stat.mod">
                        <option v-for="index in 50" :key="index" :value="index">{{ index }}</option>
                    </select>
                    <button class="btn btn-success" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                    <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                    <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-sync-alt"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});
