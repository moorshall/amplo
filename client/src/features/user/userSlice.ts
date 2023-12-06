import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../../app/store";
import { logInWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle } from "../../lib/firebase";

const initialState: UserState = {
    loading: false,
    user: undefined,
    error: undefined,
};

// create async thunk
export const login = createAsyncThunk<
    User, // Return type of the payload creator
    LoginForm, // First argument toype of the payload creator
    {
        // Optional fields for defining thunkApi field types
        dispatch: AppDispatch;
        rejectValue: string;
    }
>("user/login", async (data, thunkAPI) => {
    try {
        let res = undefined;
        if (data.googleAuth) {
            console.log("google auth");
            res = await signInWithGoogle();
        } else {
            console.log("login with e and p");
            res = await logInWithEmailAndPassword(data.email, data.password);
        }

        return res as User;
    } catch (err) {
        const error = String(err);
        console.error(`Failed to log user in: ${err}`);
        return thunkAPI.rejectWithValue(error);
    }
});

export const signup = createAsyncThunk<
    User,
    SignupForm,
    {
        dispatch: AppDispatch;
        rejectValue: string;
    }
>("/user/signup", async (data, thunkAPI) => {
    try {
        let res = undefined;
        if (data.googleAuth) {
            console.log("google auth");
            res = await signInWithGoogle();
        } else {
            console.log("register with e and p");
            res = await registerWithEmailAndPassword(data.displayName, data.email, data.password);
        }
        return res as User;
    } catch (err) {
        const error = String(err);
        console.error(`Failed to sign up user: ${err}`);
        return thunkAPI.rejectWithValue(error);
    }
});

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = undefined;
            state.error = undefined;
        },
        setUser: (state, { payload }) => {
            state.user = payload;
        },
        setError: (state, { payload }) => {
            state.error = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload;
            state.error = undefined;
        });
        builder.addCase(login.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signup.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload;
            state.error = undefined;
        });
        builder.addCase(signup.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
    },
});

export const { logout, setUser, setError } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;