<template>
<v-container style="height:100%;" fluid class="d-flex grey darken-3 align-center justify-center">
  <v-card class="px-6 py-3" height="450" width="700">
    <!-- logo image -->
    <v-row class="ma-2">
      <v-img :src="Images.logo" class="login-logo" max-height="60" max-width="120"></v-img>
    </v-row>
    <v-divider class="ma-2"></v-divider>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <!-- form -->
      <form @submit.prevent="submit">
        <!-- phone number -->
        <validation-provider v-slot="{ errors }" name="Phone number" :rules="{required: true, digits: 11}">
          <v-row class="ma-4">
            <v-text-field label="手机号码" v-model="newUser.phone" :error-messages="errors" :counter="11" prepend-icon="mdi-cellphone" dense required></v-text-field>
          </v-row>
        </validation-provider>
        <!-- password -->
        <validation-provider v-slot="{errors}" name="Password" rules="required|max:20">
          <v-row class="ma-4">
            <v-text-field dense v-model="newUser.user_password" prepend-icon="mdi-lock" @click:append="() => (value = !value)" :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'" label="密码" :type="value ? 'password' : 'text'" :counter="20" :error-messages="errors" required />
          </v-row>
        </validation-provider>
        <!-- login name -->
        <validation-provider v-slot="{errors}" name="Login name" rules="required">
          <v-row class="ma-4">
            <v-text-field dense hide-details="auto" prepend-icon="mdi-account" label="用户名字" v-model="newUser.loginName" :error-messages="errors" required />
          </v-row>
        </validation-provider>
        <validation-provider v-slot="{errors}" name="Name" rules="required">
          <v-row class="ma-4">
            <v-text-field dense hide-details="auto" prepend-icon="mdi-account" label="姓名" v-model="newUser.employeeName" :error-messages="errors" required />
          </v-row>
        </validation-provider>
        <v-row class="mx-4 mt-16">
          <v-btn type="submit" block small color="primary">
            注 册
          </v-btn>
        </v-row>
      </form>
    </validation-observer>
    <v-row class="mx-4 my-10 justify-end">
      <v-btn :to="{ path: 'login' }" rounded color="primary" text dense>已有账号，马上登录</v-btn>
    </v-row>
  </v-card>
</v-container>
</template>

<script>
import {
  required,
  digits,
  email,
  max,
  regex
} from 'vee-validate/dist/rules';
import {
  extend,
  ValidationObserver,
  ValidationProvider,
  setInteractionMode
} from 'vee-validate';
import {
  mapActions
} from "vuex";
import Images from '@/constants/image.js'
setInteractionMode('eager');
extend('digits', {
  ...digits,
  message: '{_field_} needs to be {length} digits. ({_value_})',
});
extend('required', {
  ...required,
  message: '{_field_} can not be empty.',
});
extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters.',
});
extend('regex', {
  ...regex,
  message: '{_field_} {_value_} does not match {regex}.',
});
extend('email', {
  ...email,
  message: 'Email must be valid.',
});
export default {
  data() {
    return {
      dialog: true,
      value: true,
      newUser: {
        loginName: '',
        user_password: '',
        phone: '',
        user_company_name: '',
        user_company_id: 1
      },
      Images: Images
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  methods: {
    ...mapActions("auth", ["signup"]),
    submit() {
      this.signup(this.newUser)
        .then(res => {
          // this.clear()
        })
    },
    clear() {
      this.newUser = {
        loginName: '',
        user_password: '',
        phone: '',
        user_company_name: '',
      }
    },
  }
}
</script>
