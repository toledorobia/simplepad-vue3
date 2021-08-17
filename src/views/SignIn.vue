<script setup>
import { useStore } from "vuex";
import { useRouter } from 'vue-router'
import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { toastError } from "../libs/toast";

const store = useStore();
const router = useRouter();

const schema = yup.object({
  email: yup.string().required().email().label("Email"),
  password: yup.string().required().min(6).label("Password"),
  remember: yup.boolean().default(false).label("Remember me")
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: remember, errorMessage: rememberError } = useField("remember");

const onSubmit = handleSubmit(async (values) => {
  try {
    await store.dispatch("signIn", values);
    router.replace("/home");
  }
  catch (e) {
    toastError(e);
  }
});
</script>

<template>
  <div class="container">
    <div class="row vh-100 justify-content-center align-items-center">
      <div class="col-md-4">
        <h1 class="text-center mb-5">Simplepad</h1>

        <div class="form-floating mb-3">
          <input type="email" id="email" class="form-control" placeholder="name@example.com" v-model.trim="email" :disabled="isSubmitting" />
          <label for="email">Email address</label>
          <div class="form-text text-danger">{{ emailError }}</div>
        </div>
        <div class="form-floating mb-3">
          <input type="password" class="form-control" id="password" placeholder="Password" v-model.trim="password" :disabled="isSubmitting" />
          <label for="password">Password</label>
          <div class="form-text text-danger">{{ passwordError }}</div>
        </div>

        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" id="remember" v-model="remember" :disabled="isSubmitting" />
          <label class="form-check-label" for="remember">
            Remember me
          </label>
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100 mt-3" v-on:click="onSubmit">Sign In</button>

        <div class="mt-2 text-end">
          <router-link to="/forgot-password">Forgot Password?</router-link>
        </div>

        <div class="mt-4 text-center">
          Don't have an account?
          <router-link to="/sign-up">Sign Up</router-link>
        </div>
      </div>
    </div>
  </div>
</template>