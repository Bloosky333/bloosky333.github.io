Vue.component('card', {
    props: ['title'],
    template: `
    <div class="card mb-3">
        <h5 class="text-muted">{{ title }}</h5>
        <slot></slot>
    </div>
  `
});

Vue.component('atype', {
    props: ['type', 'ki'],
    template: `
    <small class="text-muted">{{ type }} Action <span v-if="ki"> - {{ ki.max }} Ki</span></small>
  `
});

