<template>
    <v-tooltip :top="direction == 'top' && true" :bottom="direction == 'bottom' && true" z-index = 202>
        <template v-slot:activator="{ on, attrs }">
            <span
            v-bind="attrs"
            v-on="on"
            >
                {{content}}
                <slot></slot>
            </span>
        </template>
        <span>{{tooltipText}}</span>
    </v-tooltip>
</template>

<script>
export default {
    name: 'ToolTipComponent',
    props: ['content', 'tooltipText', 'direction']
}
</script>