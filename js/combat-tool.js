Vue.component('stat', {
    props: ['stat'],
    methods: {
        decreaseStat: function () {
            if(this.stat.current > 0) {
                this.stat.current -= this.stat.mod;
                this.stat.mod = 1;
            }
        },
        increaseStat: function () {
            if(this.stat.current < this.stat.max) {
                this.stat.current += this.stat.mod;
                this.stat.mod = 1;
            }
        },
        resetStat: function () {
            this.stat.current = this.stat.max;
        },
        emptyStat: function () {
            this.stat.current = 0;
        },

    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="row">
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
                    <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-refresh"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});

Vue.component('stat-setting', {
    props: ['stat'],
    methods: {
        decreaseStat: function () {
            if(this.stat.max > 0) {
                this.stat.max --;
            }
        },
        increaseStat: function () {
            this.stat.max ++;
        },
        computeStat: function () {
            
        }
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="row">
                <div class="col-4 col-md-3 pt-2">
                    <h6 class="text-capitalize">{{ stat.title }}</h6>
                </div>
                <div class="col-8 col-md-3 col-flex">
                    <input type="text" class="form-control text-center" v-model="stat.max">
                    <button class="btn btn-success" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                    <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});

Vue.component('buff', {
    props: ['stat'],
    methods: {
        decreaseStat: function () {
            if(this.stat.current > 0) {
                this.stat.current --;
            }
        },
        resetStat: function () {
            this.stat.current = this.stat.max;
        },
        emptyStat: function () {
            this.stat.current = 0;
        },

    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2">
            <div class="row">
                <div class="col-5 pt-2">
                    <h6 class="text-capitalize">{{ stat.title }}</h6>
                </div>
                <div class="col-2 flex-col">
                    <h3 class="m-0"><span class="badge" :class="{'badge-success': stat.current > 1, 'badge-warning': stat.current==1, 'badge-danger': !stat.current}">{{ stat.current }}</span></h3>
                </div>
                <div class="col-5 text-right">
                    <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-refresh"></i></button>
                    <button class="btn btn-secondary" type="button" @click="emptyStat()"><i class="fa fa-trash"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});

Vue.component('hit-rate-table', {
    props: ['bab', 'crit'],
    data: function() {
        let data = {
            minAC: 20,
            maxAC: 40,
            minOffset: -5,
            maxOffset: 6,
            headers: [],
        };

        let header;
        let bab = parseInt(this.bab, 10);
        for (let offset = data.minOffset; offset <= data.maxOffset; offset++) {
            header = offset < 0 ? offset : "+" + offset;
            data.headers.push(`${bab+offset}<br>${header}`);
        }

        return data;
    },
    computed: {
        table: function() {
            let data = [], row;
            let bab = parseInt(this.bab, 10);

            for (let ac = this.minAC; ac <= this.maxAC; ac++) {
                row = [];
                for (let offset = this.minOffset; offset <= this.maxOffset; offset++) {
                    row.push(this._getHitRate(bab + offset, ac, this.crit));
                }
                data.push({
                    header: ac,
                    row: row
                });
            }
            return data;
        },
    },
    methods: {
        _getHitRate: function (bab, ac, critDice) {
            let critMiss = 1/20;
            let crit = (21 - critDice) / 20;
            let hit = (21 + bab - ac) / 20;
            if(hit>=1){
                hit = 1 - critMiss;
            } else if(hit<=crit) {
                hit = crit;
            }
            return Math.round(hit * 100);
        }
    },
    template: `
    <div class="table-responsive">
        <table class="table table-sm text-center">
            <thead class="thead-dark">
                <tr>
                    <th class="table-sticky">AC/BAB</th>
                    <th v-for="header in headers" v-html="header"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in table">
                    <th class="table-dark table-sticky">{{row.header}}</th>
                    <td v-for="cell in row.row" :class="{'table-success': cell>=80, 'table-warning': cell<80 && cell >=50, 'table-danger': cell<50}">{{ cell }}</td>
                </tr>
            </tbody>
        </table>
    </div>
  `
});

var combatTool = new Vue({
    el: '#combat-tool',
    data: function() {
        let data = {
            activePage: "buffs",
            dbName: "pathfinder_combat_tool",
            stats: {},
            buffs: {},
        };
        let stats = {
            level: 10,
            hp: 100,
            ki: 17,
            stunning_fist: 10,
            bab: 17,
            crit: 20,
        };
        for(let key in stats) {
            data.stats[key] = {
                name: key,
                title: key.replace(/_/g, ' '),
                current: stats[key],
                max: stats[key],
                mod: 1,
            };
        }

        let buffs = {
            barkskin: stats.level * 80,
            elemental_fury: 4,
            shadow_clone: stats.level * 10,
            vanishing_trick: stats.level,
            diamond_soul: stats.level,
            ft_shadow_clone: stats.level,
            ft_vanishing_trick: stats.level,
            ft_pressure_point: stats.level,
            ft_bleeding_attack: stats.level,
            ft_weapon_focus: stats.level,
        };
        for(let key in buffs) {
            data.buffs[key] = {
                name: key,
                title: key.replace('ft_', '').replace(/_/g, ' '),
                current: 0,
                max: buffs[key],
                mod: 1,
            };
        }
        return data;
    },
    methods: {
        nextTurn: function(){
            for(key in this.buffs){
                if(this.buffs[key].current > 0){
                    this.buffs[key].current--;
                }
            }
        },
        load: function () {
            if (localStorage && localStorage.getItem(this.dbName)){
                let vm = this;
                let data = JSON.parse(localStorage.getItem(this.dbName));
                for(let key in data) {
                    if(data[key].current !== undefined){
                        vm[key].current = data[key].current;
                        vm[key].max = data[key].max;
                    }
                }
            }
        },
        save: function () {
            let data = JSON.stringify(this._data);
            localStorage.setItem(this.dbName, data);
        },
    }
});