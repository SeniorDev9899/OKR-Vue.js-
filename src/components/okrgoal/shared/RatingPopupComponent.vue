<template>
    <div class="text-center">
        <v-menu offset-y :right="true" z-index = 202 >
            <template v-slot:activator="{ on, attrs }">
                <span
                    v-bind="attrs"
                    v-on="on"
                >
                    <slot></slot>
                </span>
            </template>
            <v-list class="rating-mark-list">
                <v-list-item class="title-container">
                    <v-list-item-title>
                        请用分数描述你能完成关键指标的信心
                    </v-list-item-title>
                </v-list-item>
                <v-list-item class="rating-mark" :key="r" v-for="(r, i) in ratings" @click="selectRating(r * 2)">
                    <v-layout>
                        <v-flex>
                            <v-rating
                                v-if="ratings[10 - selected] != r"
                                :value="r"
                                :length="5"
                                empty-icon="mdi-heart-outline"
                                full-icon="mdi-heart"
                                half-icon="mdi-heart-half-full"
                                :half-increments="true"
                                :hover="false"
                                :readonly="true"
                                :size="18"
                                :dense="false"
                                color="#E3E6E8"
                                background-color="#F8F8F8"
                            ></v-rating>
                            <v-rating
                                v-else
                                :value="r"
                                :length="5"
                                empty-icon="mdi-heart-outline"
                                full-icon="mdi-heart"
                                half-icon="mdi-heart-half-full"
                                :half-increments="true"
                                :hover="false"
                                :readonly="true"
                                :size="18"
                                :dense="false"
                                color="#FFCA2A"
                                background-color="#F8F8F8"
                            ></v-rating>
                        </v-flex>
                        <v-flex>
                            {{10 - i}}分
                        </v-flex>
                    </v-layout>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
export default {
    name: 'PopupComponent',
    props: [
        'selected'
    ],
    data() {
        return {
            ratings: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5]
        }
    },
    methods: {
        selectRating(i) {
            this.$emit('selectRating', i);
        }
    }
}
</script>

<style>
    .rating-mark-list {
    }

    .rating-mark-list .title-container {
        min-height: 32px;
    }

    .rating-mark-list .v-list-item__title {
        font-size: 12px;
        color: #a7aeb4;
        letter-spacing: .3px;
        text-align: center;
    }

    .rating-mark {
        min-height: 18px;
        padding: 6px 50px;
        font-size: 12px;
    }
        .rating-mark .v-rating button {
            padding: 0;
        }

        .rating-mark:hover {
            cursor: pointer;
            background: rgba(133,194,255,.1);
        }
</style>