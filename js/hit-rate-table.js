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
            return Math.round(this.$parent._getHitRate(bab, ac, critDice) * 100);
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
