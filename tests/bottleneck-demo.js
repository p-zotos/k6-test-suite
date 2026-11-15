import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 5 },
        { duration: '10s', target: 0 },
    ],

    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed: ['rate<0.01']
    }
};

const url = 'https://quickpizza.grafana.com';

export default function () {
    const normalResponse = http.get(
        url
    );

    const delayedResponse = http.get(
        url + '/api/delay/1'
    );

    check(normalResponse, {
        'normal response status is 200': (res) => res.status === 200,
        'normal response body is not empty': (res) => res.body.length > 0
    });

    check(delayedResponse, {
        'delayed response status is 200': (res) => res.status === 200,
        'delayed response body is not empty': (res) => res.body.length > 0
    });
}
