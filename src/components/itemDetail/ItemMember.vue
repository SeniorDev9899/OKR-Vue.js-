<template>
	<div class="members">
		<div>
			<span class="mr-2">内部成员</span> <span><strong>{{internalUserCnt}}</strong></span>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<UserAvatar :name="itemOwner.substring(0, 1)" width='60px' height = '60px' />
			<div class="ml-4">
				<div>{{itemOwner}}（负责人）</div>
				<div>
					<a>转交</a>
				</div>
			</div>
		</div>
		<div class="mt-4 d-flex justify-start align-center">
			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<span v-bind="attrs" v-on="on">
						<div class="add-icon mr-4">+</div>
					</span>
				</template>
				<div>
					<UserPicker @pick="pickInternalUser" />
				</div>
			</v-menu>
			<div class="d-flex justify-start align-center mr-4" v-for="user in internalUser" v-if="internalUser != []">
				<UserAvatar :name="user.employeeName.substring(0, 1)" width='60px' height = '60px' />
				<div class="ml-4">
					<div>{{user.employeeName}}</div>
					<div>
						<a>删除</a>
					</div>
				</div>
			</div>
		</div>
		<div class="mt-4">
			<span class="mr-2">关注者</span> <span><strong>{{internalFollowerCnt}}</strong></span>
		</div>
		<div class="d-flex justify-start align-center">
			<v-menu offset-y>
				<template v-slot:activator="{ on, attrs }">
					<span v-bind="attrs" v-on="on">
						<div class="add-icon mr-4">+</div>
					</span>
				</template>
				<div>
					<UserPicker @pick="pickFollower" />
				</div>
			</v-menu>
			<div class="d-flex justify-start align-center mr-4" v-for="user in internalFollower"  v-if="internalFollower != []">
				<UserAvatar :name="user.employeeName.substring(0, 1)" width='60px' height = '60px' />
				<div class="ml-4">
					<div>{{user.employeeName}}</div>
					<div>
						<a>删除</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import UserAvatar from '@/components/common/UserAvatar.vue';
import { getUser } from '@/utils/authUser.service';
import { mapGetters, mapActions } from 'vuex';

export default {
	name: 'ItemMember',
	components: {
        UserAvatar,
		UserPicker: () => import('@/components/common/UserPicker.vue')
    },
	props: ['item'],
	data() {
		return {

		}
	},
	computed: {
		internalUser: function() {
			return this.item.item_participants;
		},
		internalUserCnt: function() {
			return this.item.item_participants.length;
		},
		internalFollower: function() {
			return this.item.item_followerses;
		},
		internalFollowerCnt: function() {
			return this.item.item_followerses.length;
		},
		itemOwner: function() {
			return getUser().employeeName;
		}
	},
	methods: {
		...mapActions('item', ['updateItemByField']),
		pickInternalUser(param) {
			this.item.item_participants.push(param.user);
			// remove duplicates
            let array = this.item.item_participants;
            const keys = ['id']
            let filtered = array.filter(
                (s => o => 
                    (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
                )
                (new Set)
            );
			this.item.item_participants = filtered;
			let participants = this.item.item_participant + param.user.id + ','
			let payload = {
				item_id: this.item.item_id,
				item_participant: participants
			}
			this.updateItemByField(payload)
		},
		pickFollower(param) {
			this.item.item_followerses.push(param.user);
			// remove duplicates
            let array = this.item.item_followerses;
            const keys = ['id']
            let filtered = array.filter(
                (s => o => 
                    (k => !s.has(k) && s.add(k))
                    (keys.map(k => o[k]).join('|'))
                )
                (new Set)
            );
			this.item.item_followerses = filtered;
			let followers = this.item.item_followers + param.user.id + ','
			let payload = {
				item_id: this.item.item_id,
				item_followers: followers
			}
			this.updateItemByField(payload)
		}	
	}
}
</script>

<style scoped>
	.add-icon {
		width: 30px;
		height: 30px;
		font-size: 14px;
		line-height: 30px;
		border-radius: 30px;
		box-shadow: none;
		background-color: #47C17F;
		text-align: center;
		color: #fff;
		padding: 0;
	}
</style>