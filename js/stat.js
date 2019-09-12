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
            <h6 class="text-capitalize m-0">{{ stat.title }}</h6>
            <div class="d-flex align-items-center">
                <div class="input-group mr-auto">
                    <input type="text" class="form-control w-40-px text-right pr-2" v-model="stat.current" :class="{'text-danger': !stat.current}">
                    <div class="input-group-append">
                        <span class="input-group-text w-30-px">/ {{ stat.max }}</span>
                    </div>
                </div>
                <div class="input-group flex-nowrap w-auto">
                    <div class="input-group-prepend">
                        <span class="input-group-text">+/-</span>
                    </div>
                    <select class="custom-select w-70-px" v-model="stat.mod">
                        <option v-for="index in 50" :key="index" :value="index">{{ index }}</option>
                    </select>
                </div>
                <button class="btn btn-success ml-1" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                <button class="btn btn-warning ml-1" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                <button class="btn btn-secondary ml-1" type="button" @click="resetStat()"><i class="fa fa-sync-alt"></i></button>
            </div>
        </div>
    </div>
  `
});
