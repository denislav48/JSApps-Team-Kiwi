import { requester } from '../requester.js';

let data = (function() {
    const LOCALSTORAGE_AUTH_KEY_NAME = 'kiwi-auth-key';
    const LOCALSTORAGE_USER_NAME_KEY = 'kiwi-user-name-key';

    // Users

    function login(username, password) {
        const body = {
            username,
            password
        };

        return requester.put('/api/auth/login', body)
            .then(function(resp) {
                let user = resp.result;
                localStorage.setItem(LOCALSTORAGE_AUTH_KEY_NAME, user.authKey);
                localStorage.setItem(LOCALSTORAGE_USER_NAME_KEY, user.name);
                return user;
            });
    }

    function register(user) {
        const body = {
            name: user.name,
            username: user.username,
            password: user.password,
            phone: user.phone,
            email: user.email
        };

        return requester.post('/api/auth/register', body);
    }

    function logout() {
        let promise = new Promise(function(resolve, reject) {
            localStorage.removeItem(LOCALSTORAGE_AUTH_KEY_NAME);
            localStorage.removeItem(LOCALSTORAGE_USER_NAME_KEY);
            resolve();
        });

        return promise;
    }

    function hasUser() {
        return !!localStorage.getItem(LOCALSTORAGE_AUTH_KEY_NAME) &&
            !!localStorage.getItem(LOCALSTORAGE_USER_NAME_KEY);
    }

    function getUser() {
        return localStorage.getItem(LOCALSTORAGE_USER_NAME_KEY);
    }

    // Categories

    function getCategory(categoryName) {
        return requester.get(`/api/categories/${categoryName}`);
    }
    
    // Classifieds

    function getCount() {
        return requester.get(`/api/classifieds/count`);
    }

    function getAd(id) {
        return requester.get(`/api/classifieds/${id}`);
    }

    function postAd(ad) {
        const body = {
            category: ad.category,
            title: ad.title,
            description: ad.description,
            price: ad.price
        };

        const category = ad.category;

        const headers = {
            'kiwi-auth-key': localStorage.getItem(LOCALSTORAGE_AUTH_KEY_NAME)
        };

        return requester.post(`/api/classifieds/${category}`, body, headers);
    }

    function postComment(comment) {
        const body = {
            id: comment.id,
            text: comment.text
        };

        const headers = {
            'kiwi-auth-key': localStorage.getItem(LOCALSTORAGE_AUTH_KEY_NAME)
        };

        return requester.post(`/api/comments/${comment.id}`, body, headers);
    }

    return {
        users: {
            login,
            register,
            logout,
            hasUser,
            getUser
        },
        categories: {
            get: getCategory
        },
        classifieds: {
            postComment: postComment,
            getCount: getCount,
            get: getAd,
            post: postAd
        }
    };

})();

export { data };