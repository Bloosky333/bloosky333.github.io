Vue.component('toggle', {
    props: ['toggle'],
    methods: {
        toggleActive(){
            this.toggle.active = !this.toggle.active;
        },
    },
    template: `
    <div class="card mb-1">
        <div class="card-body py-2 d-flex align-items-center">
            <h6 class="text-capitalize m-0 mr-auto">{{ toggle.title }}</h6>
            <div class="switch" @click="toggleActive" :class="{checked: toggle.active}"></div>
        </div>
    </div>
  `
});
