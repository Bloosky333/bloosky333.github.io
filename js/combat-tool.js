Vue.component('stat-line', {
    props: ['stat'],
    methods: {
        decreaseStat: function () {
            if(this.stat.current > 0) {
                this.stat.current--;
            }
        },
        increaseStat: function () {
            if(this.stat.current < this.stat.max) {
                this.stat.current++;
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
    <div class="row">
        <div class="col-sm-7 mb-2">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text text-capitalize input-group-text-fixed-w">{{ stat.title }}</span>
                </div>
                <input type="text" class="form-control text-center" v-model="stat.current" :class="{'text-danger': !stat.current}">
                <input type="text" class="form-control text-center" v-model="stat.max">
            </div>
        </div>
        <div class="col-sm-5 mb-2 text-right">
            <div class="btn-group"
                <button class="btn btn-success" type="button" @click="increaseStat()"><i class="fa fa-plus"></i></button>
                <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-refresh"></i></button>
                <button class="btn btn-secondary" type="button" @click="emptyStat()"><i class="fa fa-trash"></i></button>
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
        };

        data.headers = ["BAB/AC"];
        for (let ac = data.minAC; ac <= data.maxAC; ac++) {
            data.headers.push(ac);
        }

        return data;
    },
    computed: {
        table: function() {

            let data = [], row, header;
            let minOffset = -5;
            let maxOffset = 6;
            let bab = parseInt(this.bab, 10);
            for (let offset = minOffset; offset <= maxOffset; offset++) {
                row = [];
                header = offset < 0 ? offset : "+" + offset;

                for (let ac = this.minAC; ac <= this.maxAC; ac++) {
                    row.push(this._getHitRate(bab + offset, ac, this.crit));
                }
                data.push({
                    header: (bab + offset) + " (" + header + ")",
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
                    <th v-for="header in headers">{{header}}</th>
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
            dbName: "pathfinder_combat_tool",
            buffs: 'barkskin'.split(','),
            level: 10,
            damage_mod: 0,
            current_turn: 0,
            bab: 17,
            crit: 20,
        };
        let stats = {
            hp: 100,
            ki: 17,
            stunning_fist: data.level,
        };
        for(let key in stats) {
            data[key] = {
                name: key,
                title: key.replace(/_/g, ' '),
                current: stats[key],
                max: stats[key],
                is_buff: false,
            };
        }

        let buffs = {
            barkskin: data.level * 80,
            elemental_fury: 4,
            shadow_clone: data.level * 10,
            vanishing_trick: data.level,
            diamond_soul: data.level,
            ft_shadow_clone: data.level,
            ft_vanishing_trick: data.level,
            ft_pressure_point: data.level,
            ft_bleeding_attack: data.level,
            ft_weapon_focus: data.level,
        };
        for(let key in buffs) {
            data[key] = {
                name: key,
                title: key.replace(/_/g, ' '),
                current: 0,
                max: buffs[key],
                is_buff: true,
            };
        }

        return data;
    },
    methods: {
        nextTurn: function(){
            this.current_turn++;
            this.$children.forEach(function(child){
                if(child.stat.is_buff) {
                    child.decreaseStat();
                }
            });
        },
        addDamage: function() {
            this.hp.current -= this.damage_mod;
        },
        reset: function () {

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
                let staticKeys = "level,current_turn".split(',');
                staticKeys.forEach(function(key) {
                    vm[key] = data[key];
                });
                console.log(data)
            }
        },

        save: function () {
            let data = JSON.stringify(this._data);
            localStorage.setItem(this.dbName, data);
            console.log('STORED', data);
        },
    }
});