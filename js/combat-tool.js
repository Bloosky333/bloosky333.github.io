Vue.component('stat-line', {
    props: ['stat', 'is_buff'],
    methods: {
        decreaseStat: function () {
            if(this.stat.current > 0) {
                this.stat.current--;
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
        <div class="col-sm-8 mb-2">
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text text-capitalize input-group-text-fixed-w">{{ stat.title }}</span>
                </div>
                <input type="text" class="form-control text-center" v-model="stat.current" :class="{'text-danger': !stat.current}">
                <input type="text" class="form-control text-center" v-model="stat.max">
            </div>
        </div>
        <div class="col-sm-4 mb-2 text-right">
            <div class="btn-group"
                <button class="btn btn-warning" type="button" @click="decreaseStat()"><i class="fa fa-minus"></i></button>
                <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-refresh"></i></button>
                <button class="btn btn-secondary" type="button" @click="emptyStat()"><i class="fa fa-trash"></i></button>
            </div>
        </div>
    </div>
  `
})

var combatTool = new Vue({
    el: '#combat-tool',
    data: function() {
        let data = {
            dbName: "pathfinder_combat_tool",
            buffs: 'barkskin'.split(','),
            level: 10,
            damage_mod: 0,
            current_turn: 0,
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