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
                    <button class="btn btn-secondary" type="button" @click="resetStat()"><i class="fa fa-refresh"></i></button>
                </div>
            </div>
        </div>
    </div>
  `
});

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

Vue.component('buff', {
    props: ['stat'],
    methods: {
        decreaseStat(){
            if(this.stat.current > 0) {
                this.stat.current --;
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

Vue.component('toggle', {
    props: ['toggle'],
    methods: {
        toggleActive(){
            this.toggle.active = !this.toggle.active;
        },
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2 switch-box">
            <h6 class="text-capitalize">{{ toggle.title }}</h6>
            <div class="switch" @click="toggleActive" :class="{checked: toggle.active}"></div>
        </div>
    </div>
  `
});

Vue.component('hit-rate-table', {
    props: ['bab'],
    data(){
        let data = {
            minAC: 20,
            maxAC: 40,
            minOffset: -5,
            maxOffset: 6,
            headers: [],
        };

        return data;
    },
    computed: {
        table(){
            this._createHeader();

            let data = [], row;
            let bab = parseInt(this.bab, 10);
            for (let ac = this.minAC; ac <= this.maxAC; ac++) {
                row = [];
                for (let offset = this.minOffset; offset <= this.maxOffset; offset++) {
                    row.push(this._getHitRate(bab + offset, ac));
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
        _createHeader() {
            let header;
            this.headers = [];
            let bab = parseInt(this.bab, 10);
            for (let offset = this.minOffset; offset <= this.maxOffset; offset++) {
                header = offset < 0 ? offset : "+" + offset;
                this.headers.push(`${bab+offset}<br>${header}`);
            }
        },
        _getHitRate (bab, ac, critDice) {
            return Math.round(this.$parent._getHitRate(bab, ac, critDice));
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

var combatTools = new Vue({
    el: '#combat-tool',
    data() {
        let data = {
            activePage: "buffs",
            collections: "stats,buffs,toggles".split(','),
            dbName: "pathfinder_combat_tool",
            stats: {},
            buffs: {},
            toggles: {},
            self_input: {}
        };
        let stats = {
            level: 10,
            hp: 100,
            ki: 17,
            stunning_fist: 10,
            bonus_bab: 8,
            tmp_bonus_bab: 0,
            bonus_damage: 8,
            tmp_bonus_damage: 0,
            crit: 20,
            target_ac: 20,
            sneak_attack_d6: 2,
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

        let toggles = "stunned,dispatchment,elemental_fury,flanking,power_attack,jabbing_style,jabbing_master,large_size,monk_robe,ki_extra_attack,elbow_smash,medusa_wrath".split(',');
        let key;
        for(let i in toggles){
            key = toggles[i];
            data.toggles[key] = {
                name: key,
                title: key.replace(/_/g, ' '),
                active: false,
            }
        }
        return data;
    },
    watch: {
        "buffs": {
            handler(){
                this.save();
            },
            deep: true
        },
        "stats": {
            handler(){
                this.save();
            },
            deep: true
        },
        "toggles": {
            handler(){
                this.save();
            },
            deep: true
        },

    },
    created(){
        this.save = _.debounce(this._save, 1000);
        this.load();
    },
    methods: {
        nextTurn(){
            for(key in this.buffs){
                if(this.buffs[key].current > 0){
                    this.buffs[key].current--;
                }
            }
        },
        load (collectionName) {
            let data = localStorage.getItem(this.dbName);
            if (data) {
                let vm = this;
                data = JSON.parse(data);
                let fields = "current,max,active".split(',');
                this.collections.forEach(function(collectionName){
                    _.forEach(data[collectionName], function(item, itemName){
                        fields.forEach(function(field){
                             if(item[field] !== undefined){
                                 vm[collectionName][itemName][field] = item[field];
                             }
                        });
                    });
                });
                console.info("Data Loaded !");
            }
        },
        _save(){
            let vm = this;
            let data = {};
            this.collections.forEach(function(key){
                data[key] = vm[key];
            });
            localStorage.setItem(this.dbName, JSON.stringify(data));
            console.info("Data Saved !");
        },
        removeSave(){
            let response = confirm('No going back !');
            if (response) {
                localStorage.removeItem(this.dbName);
                location.reload();
            }
        },
        resetDPS(){
            this.self_input= {};
        },
        _getHitRate (bab, ac) {
            let critMiss = 1/20;
            let crit = (21 - this.stats.crit.max) / 20;
            let hit = (21 + bab - ac) / 20;
            if(hit>=1){
                hit = 1 - critMiss;
            } else if(hit<=crit) {
                hit = crit;
            }
            return hit * 100;
        },
        _parseDice(dice){
            let normalized = dice.toLowerCase().replace(/0-9\+d/g,"");
            let splitted = normalized.split('d');
            return {
                nbDice: parseInt(splitted[0] || 0, 10),
                faces: parseInt(splitted[1] || 0, 10),
            }
        },
        _diceAvg(dice, fixed) {
            if(dice){
                fixed = parseInt(fixed, 10) || 0;
                let oDice = this._parseDice(dice);
                return (((oDice.faces + 1) / 2) * oDice.nbDice) + fixed;
            } else return 0;
        },
    },
    computed: {
        self_input_total(){
            let total = 0;
            for (let key in this.self_input){
                total += parseInt(this.self_input[key], 10);
            }
            return total;
        },
        damage(){
            let damage = {
                tmp_bonus_bab: 0,
                tmp_bonus_damage: 0,
                bonus_target_ac: 0,
                ignore_dex_ac: false,
            };

            if (this.toggles.stunned.active) {
                damage.bonus_target_ac -= 2;
                damage.ignore_dex_ac = true;
            }
            if (this.toggles.flanking.active) {
                damage.tmp_bonus_bab += 2;
            }
            if (this.buffs.vanishing_trick.current > 0) {
                damage.ignore_dex_ac = true;
                damage.tmp_bonus_bab += 2;
            }
            if (this.buffs.ft_weapon_focus.current > 0) {
                damage.tmp_bonus_bab += 1;
            }

            //Power attack
            if (this.toggles.power_attack.active) {
                if (this.stats.level.max >=17){
                    damage.tmp_bonus_bab -= 5;
                    damage.tmp_bonus_damage += 10;
                } else if (this.stats.level.max >=13){
                    damage.tmp_bonus_bab -= 4;
                    damage.tmp_bonus_damage += 8;
                } else if (this.stats.level.max >=9){
                    damage.tmp_bonus_bab -= 3;
                    damage.tmp_bonus_damage += 6;
                } else if (this.stats.level.max >=5){
                    damage.tmp_bonus_bab -= 2;
                    damage.tmp_bonus_damage += 4;
                } else {
                    damage.tmp_bonus_bab -= 1;
                    damage.tmp_bonus_damage += 2;
                }
            }

            // Sneak attack
            if (damage.ignore_dex_ac || this.toggles.flanking.active) {
                if (this.toggles.dispatchment.active) {
                    damage.tmp_bonus_bab += 2;
                }
            }

            let baseDamage = {
                medium: "1d6,1d6,1d6,1d8,1d8,1d8,1d8,1d10,1d10,1d10,1d10,2d6,2d6,2d6,2d6,2d8,2d8,2d8,2d8,2d10,2d10,2d10,2d10,3d8,3d8".split(','),
                large: "1d8,1d8,1d8,2d6,2d6,2d6,2d6,2d8,2d8,2d8,2d8,3d6,3d6,3d6,3d6,3d8,3d8,3d8,3d8,4d8,4d8,4d8,4d8,4d10,4d10".split(','),
            };
            baseDamage.use = this.toggles.large_size.active ? baseDamage.large : baseDamage.medium;

            let lvlToUse = this.toggles.monk_robe.active ? this.stats.level.max + 5 : this.stats.level.max;
            damage.base_damage = baseDamage.use[lvlToUse-1];

            return damage;
        },
        attacks(){
            let attacks = [2,2];
            for (let lvl=4; lvl<=this.stats.level.max; lvl++){
                for (let i in attacks){
                    attacks[i]++;
                    if (attacks[i] == 6 && i == attacks.length-1) {
                        attacks.push(1);
                    }
                }
            }

            if (this.stats.level.max >= 14) {
                attacks.unshift(attacks[0]);
            }
            if (this.toggles.ki_extra_attack.active) {
                attacks.unshift(attacks[0]);
            }
            if (this.toggles.medusa_wrath.active && this.toggles.stunned.active) {
                attacks.unshift(attacks[0]);
                attacks.unshift(attacks[0]);
            }

            let attacksData = [];
            let total_bab;
            for (let i in attacks){
                total_bab = attacks[i] + this.total_bonus_bab;
                attacksData.push({
                    base_bab: attacks[i],
                    bonus_bab: this.total_bonus_bab,
                    bab: total_bab,
                    hit: this._getHitRate(total_bab, this.total_target_ac),
                })
            }

            return attacksData;
        },
        estimation(){
            var vm = this;
            let dmg = {};
            let fields = "base,elemental_fury,sneak_attack,elbow_smash,jabbing,total".split(',');
            fields.forEach(function(field){
                dmg[field] = {
                    hits: 0,
                    dmg: 0,
                }
            });

            let hitRate;
            let avgDmg = this._diceAvg(this.damage.base_damage, this.total_bonus_damage);
            this.attacks.forEach(function(atk){
                hitRate = vm._getHitRate(atk.bab, vm.total_target_ac) / 100;
                dmg.base.hits += hitRate;
                dmg.base.dmg +=  avgDmg * hitRate;
            });

            if(this.toggles.elbow_smash.active){
                dmg.elbow_smash.hits = this._getHitRate(this.attacks[0].bab - 5, this.total_target_ac) / 100;
                dmg.elbow_smash.dmg = avgDmg * dmg.elbow_smash.hits;
            }

            let totalHits = dmg.base.hits + dmg.elbow_smash.hits;
            if(this.buffs.elemental_fury.current > 0){
                dmg.elemental_fury.hits = totalHits;
                dmg.elemental_fury.dmg = this._diceAvg("1d6") * dmg.elemental_fury.hits;
            }
            if(this.damage.ignore_dex_ac || this.toggles.flanking.active){
                dmg.sneak_attack.hits = totalHits;
                dmg.sneak_attack.dmg = this._diceAvg(this.stats.sneak_attack_d6.max + "d6") * dmg.sneak_attack.hits;
            }
            if(this.toggles.jabbing_style.active){
                if(this.toggles.jabbing_master.active){
                    if(totalHits>=2){
                        dmg.jabbing.hits = totalHits - 1;
                        dmg.jabbing.dmg = this._diceAvg("2d6");
                        if(totalHits>=3){
                            dmg.jabbing.dmg += this._diceAvg("4d6") * (totalHits - 2);
                        } else {
                            dmg.jabbing.dmg *= dmg.jabbing.hits;
                        }
                    }
                } else {
                    dmg.jabbing.hits = totalHits - 1;
                    dmg.jabbing.dmg = this._diceAvg("1d6") * dmg.jabbing.hits;
                }
            }

            let totalDmg = 0;
            _.forEach(dmg, function (item) {
                totalDmg += item.dmg;
            });
            dmg.total.dmg = totalDmg;

            _.forEach(dmg, function (item) {
                item.hits = item.hits.toFixed(2);
                item.rawdmg = item.dmg;
                item.dmg = item.dmg.toFixed(2);
            });

            return dmg;
        },

        total_bonus_bab(){
            return this.stats.bonus_bab.max + this.stats.tmp_bonus_bab.max + this.damage.tmp_bonus_bab;
        },
        total_bonus_damage(){
            return this.stats.bonus_damage.max + this.stats.tmp_bonus_damage.max + this.damage.tmp_bonus_damage;
        },
        total_target_ac(){
            return this.stats.target_ac.max + this.damage.bonus_target_ac;
        },
        total_bab_string(){
            return [this.attacks[0].base_bab,this.stats.bonus_bab.max,this.stats.tmp_bonus_bab.max,this.damage.tmp_bonus_bab].join(' + ');
        },
        base_damage_string(){
            return this.damage.base_damage + "+" + this.total_bonus_damage;
        },
        total_damage_string(){
            return [this.stats.bonus_damage.max,this.stats.tmp_bonus_damage.max,this.damage.tmp_bonus_damage].join(' + ');
        },
    },


});