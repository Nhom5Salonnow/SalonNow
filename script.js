// Initialize Lucide icons
document.addEventListener("DOMContentLoaded", function () {
  if (window.lucide) lucide.createIcons();
});

// Smooth scroll function
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Mobile menu toggle
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  if (!menu) return;
  menu.classList.toggle("hidden");
}

// Modal: Project Overview
function openProjectModal() {
  // lazy-create modal if not present
  if (!document.getElementById("projectModal")) {
    createProjectModal();
  }
  const modal = document.getElementById("projectModal");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  const modal = document.getElementById("projectModal");
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function createProjectModal() {
  const html = `
  <div id="projectModal" class="modal-backdrop hidden" role="dialog" aria-modal="true">
  <div class="modal-panel">
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-2xl font-bold text-gray-900">SalonNow — Đặt lịch nhanh – đẹp long lanh!</h3>
        <p class="mt-2 text-gray-600">
          SalonNow là nền tảng đặt lịch ưu tiên di động, được thiết kế để hiện đại hóa việc quản lý lịch hẹn salon tại Việt Nam.
          Dưới đây là phần giới thiệu ngắn gọn và lộ trình phát triển.
        </p>
      </div>
      <button aria-label="Đóng cửa sổ" onclick="closeProjectModal()" class="text-gray-500 hover:text-gray-800">
        <i data-lucide="x" class="w-6 h-6"></i>
      </button>
    </div>
    <div class="mt-4 grid md:grid-cols-2 gap-4">
      <div>
        <h4 class="font-semibold">Giá trị cốt lõi</h4>
        <p class="text-sm text-gray-600">
          Số hóa dịch vụ làm đẹp bằng hệ thống đặt lịch thông minh và danh sách chờ tự động, giúp giảm thời gian trống và tăng doanh thu cho salon.
        </p>
        <ul class="mt-2 text-sm text-gray-600 space-y-1">
          <li>• Đặt lịch & hồ sơ liền mạch</li>
          <li>• Danh sách chờ thông minh: tự động lấp chỗ hủy</li>
          <li>• Cập nhật & thông báo theo thời gian thực</li>
        </ul>
      </div>
      <div>
        <h4 class="font-semibold">Công nghệ sử dụng</h4>
        <p class="text-sm text-gray-600">
          React Native, NestJS, PostgreSQL, JWT, Firebase Cloud Messaging, GitHub Actions CI/CD.
        </p>
        <h4 class="mt-3 font-semibold">Mục tiêu</h4>
        <p class="text-sm text-gray-600">
          Ngắn hạn: 1.000 người dùng, 100 salon.<br>
          Dài hạn: nằm trong top 3 thị trường Việt Nam.
        </p>
      </div>
    </div>
    <div class="mt-6 text-right">
      <button onclick="closeProjectModal()" class="px-4 py-2 bg-rose-400 text-white rounded-md">Đóng</button>
    </div>
  </div>
</div>
`;
  const div = document.createElement("div");
  div.innerHTML = html;
  document.body.appendChild(div);
  if (window.lucide) lucide.createIcons();
}

// Toast notifications
function showToast(message, opts = {}) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<div class="text-sm text-gray-900">${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 300);
  }, opts.duration || 3500);
}

// Simple Smart Waitlist demo simulation
function simulateWaitlistDemo() {
  const slotList = document.getElementById("slotList");
  const demoStatus = document.getElementById("demoStatus");
  if (!slotList || !demoStatus) return;
  demoStatus.textContent = "Detecting...";
  // simulate cancellation after 1s
  setTimeout(() => {
    // mark first booked slot as available and auto-book
    const items = slotList.querySelectorAll("li");
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const state = el.querySelector("span:last-child");
      if (state && state.textContent.includes("Booked")) {
        state.textContent = "Cancelled";
        el.classList.add("bg-yellow-50");
        showToast(
          "Slot 10:00 cancelled — Smart Waitlist found a match and auto-confirmed for a user."
        );
        // update status after brief pause
        setTimeout(() => {
          state.textContent = "Auto-booked";
          el.classList.remove("bg-yellow-50");
          el.classList.add("bg-green-50");
          demoStatus.textContent = "Auto-filled";
        }, 900);
        break;
      }
    }
  }, 900);
}

// Close modal on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeProjectModal();
});
