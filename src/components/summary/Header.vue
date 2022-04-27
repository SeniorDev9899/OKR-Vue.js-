<template>
    <div class="header-container">
        <div class="more-option d-flex justify-end align-center">
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-gesture-double-tap</v-icon>管理下属</v-btn>
            </div>
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-clipboard-text-outline</v-icon>上级规定</v-btn>
            </div>
            <div class="option-item-rect ml-2">
                <v-btn class="ma-2" outlined><v-icon style="font-size: 18px;">mdi-cog-outline</v-icon></v-btn>
            </div>
            <div class="option-item-rect ml-2">
                <span>了解总结</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header'
}
</script>