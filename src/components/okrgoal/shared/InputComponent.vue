<template>
    <v-layout class="input-container">
        <v-flex class="label">
            <label>
                完成度
            </label>
        </v-flex>
        <v-flex class="input d-flex align-center justify-start">
            <input type="text" :value="percentValue" @input="ev => inputValue(ev)" :class="disable && 'disable-input'" :disabled="disable" />
            <span class="addon">%</span>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    name: 'InputComponent',
    props: ['percentValue', 'disable'],
    methods: {
        inputValue(ev) {
            this.$emit('inputValue', ev.target.value);
        }
    }
}
</script>

<style scoped>
    .input-container .label {
        display:flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 20px;
        width: 40px;
    }

    .input-container input {
        box-sizing: border-box;
        position: relative;
        min-height: 36px;
        background: rgb(255, 255, 255);
        cursor: text;
        border: 1px solid rgb(233, 236, 240);
        border-radius: 4px;
        display: flex;
        -webkit-box-align: center;
        align-items: center;
        padding: 7px 7px;
        transition: border 0.2s ease 0.2s, box-shadow 0.2s ease 0.2s;
        color: #3f4755 !important;
    }

    .input-container .addon {
        margin-left: -20px;
        z-index: 100;
    }

    .input-container input:focus {
        outline: none;
        border: 1px solid rgb(40, 121, 255);
        box-shadow: rgb(40 121 255 / 30%) 0px 0px 6px 0px inset;
    }

    .disable-input {
        background-color: rgb(233, 236, 240) !important;
    }

    .disable-input:hover {
        cursor: not-allowed;
    }
</style>