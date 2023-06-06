import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

//Class for interactive API requests
class SeatingApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}${endpoint}`;
    const headers = { auth: `Bearer ${SeatingApi.token}` };
    const params = method === "get" ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  //Various routes to send to API

  //Routes related to user
  static async getCurrentUser(username) {
    let res = await this.request(`/users/${username}`);
    return res.user;
  }

  static async signup(data) {
    let res = await this.request("/auth/register", data, "post");
    return res.token;
  }

  static async login(data) {
    let res = await this.request("/auth/token", data, "post");
    return res.token;
  }

  static async saveUserProfile(username, data) {
    let res = await this.request(`/users/${username}`, data, "patch");
    return res.user;
  }

  //Period specific routes

  static async createPeriod(username, data) {
    let res = await this.request(`/periods/${username}`, data, "post");
    return res.period;
  }

  static async getPeriods(username) {
    let res = await this.request(`/periods/${username}`);
    return res.periods;
  }

  static async getPeriod(username, periodId) {
    let res = await this.request(`/periods/${username}/${periodId}`);
    return res.period;
  }

  static async updatePeriod(username, periodId, data) {
    let res = await this.request(`/periods/${username}/${periodId}`, data, "patch");
    return res.period;
  }

  static async deletePeriod(username, periodId) {
    let res = await this.request(`/periods/${username}/${periodId}`, {}, "delete");
    return res.periodId;
  }

  //Student specific Routes
  static async createStudent(username, periodId, data) {
    let res = await this.request(`/periods/${username}/${periodId}/students`, data, "post");
    return res.student;
  }

  static async updateStudent(username, periodId, studentId, data) {
    let res = await this.request(
      `/periods/${username}/${periodId}/students/${studentId}`,
      data,
      "patch"
    );
    return res.student;
  }

  static async deleteStudent(username, periodId, studentId) {
    let res = await this.request(
      `/periods/${username}/${periodId}/students/${studentId}`,
      {},
      "delete"
    );
    return res.studentId;
  }

  //Classroom specific routes

  static async getClassroom(username) {
    let res = await this.request(`/classrooms/${username}`);
    return res.classroom;
  }

  static async createClassroom(username) {
    let res = await this.request(`/classrooms/${username}`, {}, "post");
    return res.classroom;
  }

  static async updateClassroom(username, classroomId, data) {
    let res = await this.request(`/classrooms/${username}/${classroomId}`, data, "patch");
    return res.classroom;
  }

  // Seating Chart Specific Routes

  static async createSeatingChart(username, classroomId, data) {
    let res = await this.request(
      `/classrooms/${username}/${classroomId}/seating-charts`,
      data,
      "post"
    );
    return res.seatingChart;
  }

  static async getSeatingCharts(username, classroomId) {
    let res = await this.request(`/classrooms/${username}/${classroomId}/seating-charts`);
    return res.seatingChart;
  }

  static async getSeatingChart(username, classroomId, seatingChartId) {
    let res = await this.request(`/classrooms/${username}/${classroomId}/seating-charts/${seatingChartId}`);
    return res.seatingChart;
  }

  static async updateSeatingChart(username, classroomId, seatingChartId, data) {
    let res = await this.request(
      `/classrooms/${username}/${classroomId}/seating-charts/${seatingChartId}`,
      data,
      "patch"
    );
    return res.seatingChart;
  }

  static async deleteSeatingChart(username, classroomId, seatingChartId) {
    let res = await this.request(`/classrooms/${username}/${classroomId}/seating-charts/${seatingChartId}`, {}, "delete");
    return res.seatingChart.number;
  }
}

export default SeatingApi;
