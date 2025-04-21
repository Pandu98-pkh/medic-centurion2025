document.addEventListener('DOMContentLoaded', function () {
    // Set automatic date and time and start real-time clock
    setCurrentDateTime();

    // Show dashboard by default
    document.getElementById('dashboard').style.display = 'block';

    // Navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Stop real-time clock if leaving form section
            if (document.querySelector('.nav-link.active').getAttribute('data-target') === 'form') {
                stopRealtimeClock();
            }

            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });

            // Show the target section
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).style.display = 'block';

            // Start real-time clock if entering form section
            if (targetId === 'form') {
                startRealtimeClock();
            }
        });
    });

    // Set current date and time
    function setCurrentDateTime() {
        const now = new Date();
        const dateInput = document.getElementById('tanggal');
        const timeInput = document.getElementById('waktu');

        // Format date as YYYY-MM-DD
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        // Format time as HH:MM
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const formattedTime = `${hours}:${minutes}`;

        dateInput.value = formattedDate;
        timeInput.value = formattedTime;

        // Start real-time clock update
        startRealtimeClock();
    }

    // Function to start real-time clock
    function startRealtimeClock() {
        // Clear any existing interval
        stopRealtimeClock();

        // Update time every second
        window.clockInterval = setInterval(function () {
            const now = new Date();
            const timeInput = document.getElementById('waktu');

            // Format time as HH:MM
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const formattedTime = `${hours}:${minutes}`;

            timeInput.value = formattedTime;
        }, 1000);
    }

    // Function to stop real-time clock
    function stopRealtimeClock() {
        if (window.clockInterval) {
            clearInterval(window.clockInterval);
        }
    }

    // Helper function for Indonesian date formatting
    function formatDateIndonesia(dateString) {
        // Handle undefined or null input
        if (!dateString) {
            return '-';
        }

        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        try {
            let date;
            if (typeof dateString === 'string') {
                if (dateString.includes('T')) {
                    // Handle ISO date string
                    date = new Date(dateString);
                } else if (dateString.includes('-')) {
                    // Handle YYYY-MM-DD format
                    const [year, month, day] = dateString.split('-');
                    date = new Date(year, month - 1, day);
                } else {
                    // Handle other formats
                    date = new Date(dateString);
                }
            } else {
                // Handle direct Date object
                date = new Date(dateString);
            }

            if (isNaN(date.getTime())) {
                return '-';
            }

            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();

            return `${day} ${month} ${year}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '-';
        }
    }

    // Function to format time
    function formatTime(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Modal functionality
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modalOverlay = this.closest('.modal-overlay');
            closeModal(modalOverlay);
        });
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');

        // Close modal when clicking outside
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(modal);
            }
        });
    }

    function closeModal(modal) {
        modal.classList.remove('active');
    }

    // Toast message functionality
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        // Show the toast (with animation)
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Add event listener to close button
        toast.querySelector('.toast-close').addEventListener('click', function () {
            toast.classList.remove('show');
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (container.contains(toast)) {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(toast)) {
                        container.removeChild(toast);
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add row to tables
    document.getElementById('addKasusRow').addEventListener('click', function () {
        addTableRow('dataKasusTable', [
            document.querySelectorAll('#dataKasusTable tbody tr').length + 1,
            '<input type="time" name="kasus_waktu[]">',
            '<input type="text" name="kasus_nama[]">',
            '<select name="kasus_jk[]"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>',
            '<input type="text" name="kasus_keluhan[]">',
            '<input type="text" name="kasus_penanganan[]">',
            '<input type="text" name="kasus_hasil[]">',
            '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
        ]);
        showToast('Baris baru ditambahkan', 'success');
    });

    document.getElementById('addObatRow').addEventListener('click', function () {
        addTableRow('penggunaanObatTable', [
            document.querySelectorAll('#penggunaanObatTable tbody tr').length + 1,
            '<input type="text" name="obat_nama[]">',
            '<input type="number" name="obat_awal[]" class="obat-awal" min="0" step="0.01">',
            '<input type="number" name="obat_terpakai[]" class="obat-terpakai" min="0" step="0.01">',
            '<input type="number" name="obat_sisa[]" class="obat-sisa" readonly step="0.01">',
            '<input type="text" name="obat_keterangan[]">',
            '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
        ]);

        // Add event listeners for automatic sisa calculation
        addSisaCalculationEvents();
        showToast('Baris baru ditambahkan', 'success');
    });

    document.getElementById('addPerlengkapanRow').addEventListener('click', function () {
        addTableRow('perlengkapanTable', [
            document.querySelectorAll('#perlengkapanTable tbody tr').length + 1,
            '<input type="text" name="perlengkapan_nama[]">',
            '<select name="perlengkapan_awal[]"><option value="Baik">Baik</option><option value="Cukup Baik">Cukup Baik</option><option value="Kurang Baik">Kurang Baik</option><option value="Rusak">Rusak</option></select>',
            '<select name="perlengkapan_akhir[]"><option value="Baik">Baik</option><option value="Cukup Baik">Cukup Baik</option><option value="Kurang Baik">Kurang Baik</option><option value="Rusak">Rusak</option></select>',
            '<input type="text" name="perlengkapan_keterangan[]">',
            '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
        ]);
        showToast('Baris baru ditambahkan', 'success');
    });

    document.getElementById('addRujukanRow').addEventListener('click', function () {
        addTableRow('rujukanTable', [
            document.querySelectorAll('#rujukanTable tbody tr').length + 1,
            '<input type="text" name="rujukan_nama[]">',
            '<input type="text" name="rujukan_alasan[]">',
            '<input type="text" name="rujukan_tujuan[]">',
            '<input type="time" name="rujukan_waktu[]">',
            '<input type="text" name="rujukan_keterangan[]">',
            '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
        ]);
        showToast('Baris baru ditambahkan', 'success');
    });

    // Function to add a new row to a table
    function addTableRow(tableId, cellContents) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        const row = document.createElement('tr');

        cellContents.forEach(content => {
            const cell = document.createElement('td');
            cell.innerHTML = content;
            row.appendChild(cell);
        });

        tbody.appendChild(row);

        // Add event listener to delete button
        const deleteBtn = row.querySelector('.delete-row-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function () {
                confirmDeleteRow(this);
            });
        }
    }

    // Function to confirm delete a table row
    function confirmDeleteRow(button) {
        const row = button.closest('tr');
        const tbody = row.parentNode;
        const rowIndex = Array.from(tbody.children).indexOf(row);

        document.getElementById('confirmMessage').textContent = 'Apakah Anda yakin ingin menghapus baris ini?';

        // Set up confirm modal buttons
        document.getElementById('confirmAction').onclick = function () {
            tbody.removeChild(row);

            // Renumber rows
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                row.cells[0].textContent = index + 1;
            });

            closeModal(document.getElementById('confirmModal'));
            showToast('Baris berhasil dihapus', 'info');
        };

        document.getElementById('cancelAction').onclick = function () {
            closeModal(document.getElementById('confirmModal'));
        };

        openModal('confirmModal');
    }

    // Add event listeners to existing delete buttons
    document.querySelectorAll('.delete-row-btn').forEach(button => {
        button.addEventListener('click', function () {
            confirmDeleteRow(this);
        });
    });

    // Function to calculate "Sisa" automatically
    function addSisaCalculationEvents() {
        const rows = document.querySelectorAll('#penggunaanObatTable tbody tr');

        rows.forEach(row => {
            const awalInput = row.querySelector('.obat-awal');
            const terpakaiInput = row.querySelector('.obat-terpakai');
            const sisaInput = row.querySelector('.obat-sisa');

            if (awalInput && terpakaiInput && sisaInput) {
                const calculateSisa = function () {
                    const awal = parseFloat(awalInput.value) || 0;
                    const terpakai = parseFloat(terpakaiInput.value) || 0;
                    sisaInput.value = (awal - terpakai).toFixed(2);
                };

                awalInput.addEventListener('input', calculateSisa);
                terpakaiInput.addEventListener('input', calculateSisa);

                // Initial calculation
                calculateSisa();
            }
        });
    }

    // Initialize sisa calculation for existing rows
    addSisaCalculationEvents();

    // Function to convert all data to CSV
    function convertAllDataToCSV(dataArray) {
        // Create CSV header for main data
        let csvContent = "id,tanggal_input,petugas,tanggal,lokasi,cabor,waktu,kendala,solusi,rekomendasi\n";

        // Add data rows
        dataArray.forEach(data => {
            csvContent += `${data.id},${formatDateIndonesia(data.tanggal)},${escapeCSV(data.petugas)},${data.tanggal},${escapeCSV(data.lokasi)},${escapeCSV(data.cabor)},${data.waktu},${escapeCSV(data.kendala || "")},${escapeCSV(data.solusi || "")},${escapeCSV(data.rekomendasi || "")}\n`;
        });

        // Add separator
        csvContent += "\n\n";

        // Add Kasus Data
        csvContent += "id,Waktu,Nama Pasien,Jenis Kelamin,Keluhan/Cedera,Penanganan,Hasil\n";

        dataArray.forEach(data => {
            if (Array.isArray(data.kasus_nama)) {
                for (let i = 0; i < data.kasus_nama.length; i++) {
                    if (data.kasus_nama[i] && data.kasus_nama[i].trim() !== '') {
                        csvContent += `${data.id},${data.kasus_waktu ? data.kasus_waktu[i] || '' : ''},${escapeCSV(data.kasus_nama[i] || '')},${data.kasus_jk ? data.kasus_jk[i] || '' : ''},${escapeCSV(data.kasus_keluhan ? data.kasus_keluhan[i] || '' : '')},${escapeCSV(data.kasus_penanganan ? data.kasus_penanganan[i] || '' : '')},${escapeCSV(data.kasus_hasil ? data.kasus_hasil[i] || '' : '')}\n`;
                    }
                }
            }
        });

        // Add separator
        csvContent += "\n\n";

        // Add Obat Data
        csvContent += "id,Nama Item,Jumlah Awal,Jumlah Terpakai,Sisa,Keterangan\n";

        dataArray.forEach(data => {
            if (Array.isArray(data.obat_nama)) {
                for (let i = 0; i < data.obat_nama.length; i++) {
                    if (data.obat_nama[i] && data.obat_nama[i].trim() !== '') {
                        csvContent += `${data.id},${escapeCSV(data.obat_nama[i] || '')},${data.obat_awal ? data.obat_awal[i] || '' : ''},${data.obat_terpakai ? data.obat_terpakai[i] || '' : ''},${data.obat_sisa ? data.obat_sisa[i] || '' : ''},${escapeCSV(data.obat_keterangan ? data.obat_keterangan[i] || '' : '')}\n`;
                    }
                }
            }
        });

        // Add separator
        csvContent += "\n\n";

        // Add Perlengkapan Data
        csvContent += "id,Nama Perlengkapan,Kondisi Awal,Kondisi Akhir,Keterangan\n";

        dataArray.forEach(data => {
            if (Array.isArray(data.perlengkapan_nama)) {
                for (let i = 0; i < data.perlengkapan_nama.length; i++) {
                    if (data.perlengkapan_nama[i] && data.perlengkapan_nama[i].trim() !== '') {
                        csvContent += `${data.id},${escapeCSV(data.perlengkapan_nama[i] || '')},${escapeCSV(data.perlengkapan_awal ? data.perlengkapan_awal[i] || '' : '')},${escapeCSV(data.perlengkapan_akhir ? data.perlengkapan_akhir[i] || '' : '')},${escapeCSV(data.perlengkapan_keterangan ? data.perlengkapan_keterangan[i] || '' : '')}\n`;
                    }
                }
            }
        });

        // Add separator
        csvContent += "\n\n";

        // Add Rujukan Data
        csvContent += "id,Nama Pasien,Alasan Rujukan,Fasilitas Kesehatan Tujuan,Waktu Rujukan,Keterangan\n";

        dataArray.forEach(data => {
            if (Array.isArray(data.rujukan_nama)) {
                for (let i = 0; i < data.rujukan_nama.length; i++) {
                    if (data.rujukan_nama[i] && data.rujukan_nama[i].trim() !== '') {
                        csvContent += `${data.id},${escapeCSV(data.rujukan_nama[i] || '')},${escapeCSV(data.rujukan_alasan ? data.rujukan_alasan[i] || '' : '')},${escapeCSV(data.rujukan_tujuan ? data.rujukan_tujuan[i] || '' : '')},${data.rujukan_waktu ? data.rujukan_waktu[i] || '' : ''},${escapeCSV(data.rujukan_keterangan ? data.rujukan_keterangan[i] || '' : '')}\n`;
                    }
                }
            }
        });

        return csvContent;
    }

    // Function to escape CSV values
    function escapeCSV(value) {
        if (value === null || value === undefined) return "";
        return `"${String(value).replace(/"/g, '""')}"`;
    }

    // Function to download CSV
    function downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        // Create download link
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Download all data as CSV
    document.getElementById('downloadCSVAll').addEventListener('click', function () {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
        if (savedData.length === 0) {
            showToast('Belum ada data yang tersimpan', 'error');
            return;
        }

        const csvContent = convertAllDataToCSV(savedData);
        downloadCSV(csvContent, 'riwayat.csv');
        showToast('Data CSV berhasil diunduh', 'success');
    });

    // Export data to JSON file
    document.getElementById('exportDataBtn').addEventListener('click', function () {
        exportData();
    });

    function exportData() {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];

        if (savedData.length === 0) {
            showToast('Belum ada data yang tersimpan', 'error');
            return;
        }

        // Convert data to JSON string
        const jsonData = JSON.stringify(savedData, null, 2);

        // Create a blob and download link
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data_tim_medis.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast('Data berhasil diekspor', 'success');
    }

    // Import trigger and file input
    document.getElementById('importTriggerBtn').addEventListener('click', function () {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function () {
        const importBtn = document.getElementById('importDataBtn');
        importBtn.disabled = !this.files || this.files.length === 0;

        if (!importBtn.disabled) {
            showToast('File dipilih. Klik "Proses Impor" untuk melanjutkan.', 'info');
        }
    });

    // Import data button
    document.getElementById('importDataBtn').addEventListener('click', function () {
        openModal('importOptionsModal');
    });

    // Import option handlers
    document.getElementById('cancelImport').addEventListener('click', function () {
        closeModal(document.getElementById('importOptionsModal'));
        document.getElementById('fileInput').value = '';
        document.getElementById('importDataBtn').disabled = true;
    });

    document.getElementById('confirmImport').addEventListener('click', function () {
        const option = document.querySelector('input[name="importOption"]:checked').value;
        processImport(option);
        closeModal(document.getElementById('importOptionsModal'));
    });

    // Function to process the import
    function processImport(option) {
        const fileInput = document.getElementById('fileInput');

        if (!fileInput.files || fileInput.files.length === 0) {
            showToast('Silakan pilih file terlebih dahulu', 'error');
            return;
        }

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const importedData = JSON.parse(e.target.result);

                // Validate imported data
                if (!Array.isArray(importedData)) {
                    throw new Error('Format data tidak valid');
                }

                if (option === 'replace') {
                    // Replace all existing data
                    localStorage.setItem('medicalDocuments', JSON.stringify(importedData));
                } else if (option === 'merge') {
                    // Merge with existing data
                    const existingData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
                    const mergedData = [...existingData];

                    // Merge based on unique IDs
                    importedData.forEach(item => {
                        const index = mergedData.findIndex(doc => doc.id === item.id);
                        if (index !== -1) {
                            mergedData[index] = item; // Replace existing
                        } else {
                            mergedData.push(item); // Add new
                        }
                    });

                    localStorage.setItem('medicalDocuments', JSON.stringify(mergedData));
                }

                showToast('Data berhasil diimpor', 'success');
                updateDashboard();
                updateHistory();

                // Reset file input
                fileInput.value = '';
                document.getElementById('importDataBtn').disabled = true;
            } catch (error) {
                showToast(`Gagal mengimpor data: ${error.message}`, 'error');
            }
        };

        reader.readAsText(file);
    }

    // Update signature sections in the form
    const signatureSectionPetugas = document.querySelector('.signature-section:nth-child(1)');
    const signatureSectionKoordinator = document.querySelector('.signature-section:nth-child(2)');

    // Modify the petugas signature section
    signatureSectionPetugas.innerHTML = `
        <h4>Tanda Tangan Petugas Medis</h4>
        <div class="signature-preview" id="signaturePreviewPetugas" style="border: 1px solid #ccc; height: 100px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9;">
            <span class="no-signature-text">Belum ada tanda tangan</span>
        </div>
        <button type="button" class="btn-primary open-signature-modal" data-type="Petugas">
            <i class="fas fa-signature"></i> Tambah Tanda Tangan
        </button>
        <div class="form-group" style="margin-top: 10px;">
            <label for="namaPetugas">Nama Lengkap:</label>
            <input type="text" id="namaPetugas" name="namaPetugas" required>
        </div>
        <div class="form-group">
            <label for="nimPetugas">NIM:</label>
            <input type="text" id="nimPetugas" name="nimPetugas" required>
        </div>
        <input type="hidden" id="signatureDataPetugas" name="signatureDataPetugas">
        <input type="hidden" id="signatureFilenamePetugas" name="signatureFilenamePetugas">
    `;

    // Modify the koordinator signature section
    signatureSectionKoordinator.innerHTML = `
        <h4>Tanda Tangan Koordinator</h4>
        <div class="signature-preview" id="signaturePreviewKoordinator" style="border: 1px solid #ccc; height: 100px; margin-bottom: 10px; display: flex; align-items: center; justify-content: center; background-color: #f9f9f9;">
            <span class="no-signature-text">Belum ada tanda tangan</span>
        </div>
        <button type="button" class="btn-primary open-signature-modal" data-type="Koordinator">
            <i class="fas fa-signature"></i> Tambah Tanda Tangan
        </button>
        <div class="form-group" style="margin-top: 10px;">
            <label for="namaKoordinator">Nama Lengkap:</label>
            <input type="text" id="namaKoordinator" name="namaKoordinator" required>
        </div>
        <div class="form-group">
            <label for="nimKoordinator">NIM:</label>
            <input type="text" id="nimKoordinator" name="nimKoordinator" required>
        </div>
        <input type="hidden" id="signatureDataKoordinator" name="signatureDataKoordinator">
        <input type="hidden" id="signatureFilenameKoordinator" name="signatureFilenameKoordinator">
    `;

    // Track current signature type
    let currentSignatureType = '';
    let signaturePadModal;

    // Initialize signature modal canvas
    function initSignatureModal() {
        const canvasModal = document.getElementById('signatureModalCanvas');
        signaturePadModal = new SignaturePad(canvasModal, {
            backgroundColor: 'rgb(255, 255, 255)',
            penColor: 'rgb(0, 0, 0)'
        });

        // Initialize with correct size
        resizeModalCanvas();
    }

    function resizeModalCanvas() {
        const canvasModal = document.getElementById('signatureModalCanvas');
        if (!canvasModal) return;

        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const context = canvasModal.getContext("2d");

        // Get parent width
        const width = canvasModal.parentElement.offsetWidth;
        const height = 200;

        // Adjust canvas for high DPI display
        canvasModal.width = width * ratio;
        canvasModal.height = height * ratio;
        canvasModal.style.width = width + "px";
        canvasModal.style.height = height + "px";

        // Scale context for high DPI display
        context.scale(ratio, ratio);
    }

    // Open signature modal
    document.querySelectorAll('.open-signature-modal').forEach(button => {
        button.addEventListener('click', function () {
            currentSignatureType = this.getAttribute('data-type');

            // Set modal title
            document.getElementById('signatureModalTitle').textContent = `Tanda Tangan ${currentSignatureType}`;

            // Initialize modal if not done yet
            if (!signaturePadModal) {
                initSignatureModal();
            } else {
                // Clear the canvas
                signaturePadModal.clear();
            }

            // Check if we have an existing signature to edit
            const existingSignatureData = document.getElementById(`signatureData${currentSignatureType}`).value;
            if (existingSignatureData) {
                signaturePadModal.fromDataURL(existingSignatureData);
            }

            // Open the modal
            openModal('signatureModal');

            // Resize canvas to ensure correct display
            setTimeout(resizeModalCanvas, 100);
        });
    });

    // Clear signature in modal
    document.getElementById('clearModalSignature').addEventListener('click', function () {
        if (signaturePadModal) {
            signaturePadModal.clear();
        }
    });

    // Cancel signature
    document.getElementById('cancelSignature').addEventListener('click', function () {
        closeModal(document.getElementById('signatureModal'));
    });

    // Save signature
    document.getElementById('saveSignature').addEventListener('click', function () {
        if (!signaturePadModal || signaturePadModal.isEmpty()) {
            showToast('Harap buat tanda tangan terlebih dahulu', 'error');
            return;
        }

        const signatureData = signaturePadModal.toDataURL();

        // Get name for filename
        let nama = '';
        if (currentSignatureType === 'Petugas') {
            nama = document.getElementById('namaPetugas').value || 'Petugas';
        } else {
            nama = document.getElementById('namaKoordinator').value || 'Koordinator';
        }

        // Format: nama_tanggal_waktu
        const now = new Date();
        const tanggal = now.toISOString().split('T')[0].replace(/-/g, '');
        const waktu = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        const filename = `${nama}_${tanggal}_${waktu}`;

        // Save to hidden fields
        document.getElementById(`signatureData${currentSignatureType}`).value = signatureData;
        document.getElementById(`signatureFilename${currentSignatureType}`).value = filename;

        // Update preview
        const previewElement = document.getElementById(`signaturePreview${currentSignatureType}`);
        previewElement.innerHTML = `<img src="${signatureData}" style="max-width: 100%; max-height: 100px;">`;

        closeModal(document.getElementById('signatureModal'));
        showToast('Tanda tangan berhasil disimpan', 'success');
    });

    // Window resize handler for modal canvas
    window.addEventListener('resize', function () {
        if (document.getElementById('signatureModal').classList.contains('active')) {
            // Save current signature
            let signatureData = null;
            if (signaturePadModal && !signaturePadModal.isEmpty()) {
                signatureData = signaturePadModal.toDataURL();
            }

            // Resize canvas
            resizeModalCanvas();

            // Restore signature if there was one
            if (signatureData && signaturePadModal) {
                signaturePadModal.fromDataURL(signatureData);
            }
        }
    });

    // Add touch event handlers to prevent scrolling on signature canvas
    document.addEventListener('DOMContentLoaded', function () {
        const canvasModal = document.getElementById('signatureModalCanvas');
        if (canvasModal) {
            canvasModal.addEventListener('touchstart', function (e) {
                e.preventDefault();
            });

            canvasModal.addEventListener('touchmove', function (e) {
                e.preventDefault();
            });

            canvasModal.addEventListener('touchend', function (e) {
                e.preventDefault();
            });
        }
    });

    // Save form data
    document.getElementById('medicalForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            showToast('Mohon lengkapi data dengan benar', 'error');
            return;
        }

        // Get and normalize cabor (make first letter of each word uppercase)
        const caborInput = document.getElementById('cabor').value.trim();
        const normalizedCabor = caborInput
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        // Get basic form data
        const formDataObj = {
            id: document.getElementById('formMode').value === 'edit'
                ? parseInt(document.getElementById('editItemId').value)
                : Date.now(),
            petugas: document.getElementById('petugas').value,
            tanggal: document.getElementById('tanggal').value,
            lokasi: document.getElementById('lokasi').value,
            cabor: normalizedCabor, // Use normalized cabor value
            waktu: document.getElementById('waktu').value,
            kendala: document.getElementById('kendala').value,
            solusi: document.getElementById('solusi').value,
            rekomendasi: document.getElementById('rekomendasi').value,
            date: new Date().toISOString(),
            action: document.getElementById('formMode').value === 'edit' ? 'edit' : 'add',
            actionText: document.getElementById('formMode').value === 'edit' ? 'mengedit' : 'mendokumentasikan'
        };

        // Collect table data
        // Kasus data
        formDataObj.kasus_waktu = [];
        formDataObj.kasus_nama = [];
        formDataObj.kasus_jk = [];
        formDataObj.kasus_keluhan = [];
        formDataObj.kasus_penanganan = [];
        formDataObj.kasus_hasil = [];

        const kasusRows = document.querySelectorAll('#dataKasusTable tbody tr');
        kasusRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            formDataObj.kasus_waktu.push(cells[1].querySelector('input').value);
            formDataObj.kasus_nama.push(cells[2].querySelector('input').value);
            formDataObj.kasus_jk.push(cells[3].querySelector('select').value);
            formDataObj.kasus_keluhan.push(cells[4].querySelector('input').value);
            formDataObj.kasus_penanganan.push(cells[5].querySelector('input').value);
            formDataObj.kasus_hasil.push(cells[6].querySelector('input').value);
        });

        // Obat data
        formDataObj.obat_nama = [];
        formDataObj.obat_awal = [];
        formDataObj.obat_terpakai = [];
        formDataObj.obat_sisa = [];
        formDataObj.obat_keterangan = [];

        const obatRows = document.querySelectorAll('#penggunaanObatTable tbody tr');
        obatRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            formDataObj.obat_nama.push(cells[1].querySelector('input').value);
            formDataObj.obat_awal.push(cells[2].querySelector('input').value);
            formDataObj.obat_terpakai.push(cells[3].querySelector('input').value);
            formDataObj.obat_sisa.push(cells[4].querySelector('input').value);
            formDataObj.obat_keterangan.push(cells[5].querySelector('input').value);
        });

        // Perlengkapan data
        formDataObj.perlengkapan_nama = [];
        formDataObj.perlengkapan_awal = [];
        formDataObj.perlengkapan_akhir = [];
        formDataObj.perlengkapan_keterangan = [];

        const perlengkapanRows = document.querySelectorAll('#perlengkapanTable tbody tr');
        perlengkapanRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            formDataObj.perlengkapan_nama.push(cells[1].querySelector('input').value);
            formDataObj.perlengkapan_awal.push(cells[2].querySelector('select').value);
            formDataObj.perlengkapan_akhir.push(cells[3].querySelector('select').value);
            formDataObj.perlengkapan_keterangan.push(cells[4].querySelector('input').value);
        });

        // Rujukan data
        formDataObj.rujukan_nama = [];
        formDataObj.rujukan_alasan = [];
        formDataObj.rujukan_tujuan = [];
        formDataObj.rujukan_waktu = [];
        formDataObj.rujukan_keterangan = [];

        const rujukanRows = document.querySelectorAll('#rujukanTable tbody tr');
        rujukanRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            formDataObj.rujukan_nama.push(cells[1].querySelector('input').value);
            formDataObj.rujukan_alasan.push(cells[2].querySelector('input').value);
            formDataObj.rujukan_tujuan.push(cells[3].querySelector('input').value);
            formDataObj.rujukan_waktu.push(cells[4].querySelector('input').value);
            formDataObj.rujukan_keterangan.push(cells[5].querySelector('input').value);
        });

        // Get signature data with filenames
        formDataObj.signaturePetugas = document.getElementById('signatureDataPetugas').value;
        formDataObj.signatureKoordinator = document.getElementById('signatureDataKoordinator').value;
        formDataObj.signatureFilenamePetugas = document.getElementById('signatureFilenamePetugas').value;
        formDataObj.signatureFilenameKoordinator = document.getElementById('signatureFilenameKoordinator').value;
        formDataObj.namaPetugas = document.getElementById('namaPetugas').value;
        formDataObj.nimPetugas = document.getElementById('nimPetugas').value;
        formDataObj.namaKoordinator = document.getElementById('namaKoordinator').value;
        formDataObj.nimKoordinator = document.getElementById('nimKoordinator').value;

        // Get saved data
        let savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];

        // Check if we're in edit mode
        const formMode = document.getElementById('formMode').value;
        const editItemId = parseInt(document.getElementById('editItemId').value);

        if (formMode === 'edit' && editItemId) {
            const index = savedData.findIndex(item => item.id === editItemId);
            if (index !== -1) {
                formDataObj.id = editItemId; // Keep the original ID
                savedData[index] = formDataObj;
                showToast('Dokumentasi berhasil diperbarui!', 'success');
            }
        } else {
            // Add new record
            savedData.push(formDataObj);
            showToast('Dokumentasi berhasil disimpan!', 'success');
        }

        // Save to localStorage
        localStorage.setItem('medicalDocuments', JSON.stringify(savedData));

        // Update recent activities
        let recentActs = JSON.parse(localStorage.getItem('recentActivities')) || [];
        recentActs.unshift(formDataObj);
        recentActs = recentActs.slice(0, 5);
        localStorage.setItem('recentActivities', JSON.stringify(recentActs));

        // Reset form
        this.reset();
        setCurrentDateTime();
        resetTableRows();

        // Clear signature previews
        document.getElementById('signaturePreviewPetugas').innerHTML = '<span class="no-signature-text">Belum ada tanda tangan</span>';
        document.getElementById('signaturePreviewKoordinator').innerHTML = '<span class="no-signature-text">Belum ada tanda tangan</span>';
        document.getElementById('signatureDataPetugas').value = '';
        document.getElementById('signatureDataKoordinator').value = '';
        document.getElementById('signatureFilenamePetugas').value = '';
        document.getElementById('signatureFilenameKoordinator').value = '';

        // Update displays
        updateDashboard();
        updateHistory();

        // Navigate to dashboard
        document.querySelector('.nav-link[data-target="dashboard"]').click();
    });

    // Fix save changes button functionality
    document.getElementById('submitBtn').addEventListener('click', function (e) {
        const formMode = document.getElementById('formMode').value;
        if (formMode === 'edit') {
            if (validateForm()) {
                document.getElementById('medicalForm').dispatchEvent(new Event('submit'));
            } else {
                showToast('Mohon lengkapi data dengan benar', 'error');
            }
        }
    });

    // Remove old cancel button event listener and replace with new one
    document.getElementById('cancelBtn').addEventListener('click', function () {
        document.getElementById('confirmMessage').textContent = 'Batalkan perubahan? Semua perubahan akan hilang.';
        document.getElementById('confirmAction').textContent = 'Ya, Batalkan';
        document.getElementById('confirmAction').className = 'btn btn-warning';

        // Set up confirm modal buttons
        document.getElementById('confirmAction').onclick = function () {
            // Reset form mode
            document.getElementById('formMode').value = 'add';
            document.getElementById('editItemId').value = '';
            document.getElementById('formTitle').textContent = 'Form Dokumentasi Tim Medis';
            document.getElementById('submitBtn').textContent = 'Simpan Dokumentasi';
            document.getElementById('cancelBtn').style.display = 'none';

            // Reset form and tables
            document.getElementById('medicalForm').reset();
            setCurrentDateTime();
            resetTableRows();

            closeModal(document.getElementById('confirmModal'));
            showToast('Pengeditan dibatalkan', 'info');
        };

        document.getElementById('cancelAction').onclick = function () {
            closeModal(document.getElementById('confirmModal'));
        };

        openModal('confirmModal');
    });

    // Function to enable edit mode for an existing record
    function editItem(id) {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
        const item = savedData.find(doc => doc.id === id);

        if (item) {
            // Switch to form view
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('data-target') === 'form') {
                    link.click();
                }
            });
            // Set form in edit mode
            document.getElementById('formMode').value = 'edit';
            document.getElementById('editItemId').value = id;
            document.getElementById('formTitle').textContent = 'Edit Dokumentasi Tim Medis';
            document.getElementById('submitBtn').textContent = 'Simpan Perubahan';
            document.getElementById('cancelBtn').style.display = 'inline-block';

            // Fill form with data - notice we're not setting the time, it will be current real-time
            document.getElementById('petugas').value = item.petugas;
            document.getElementById('tanggal').value = item.tanggal;
            document.getElementById('lokasi').value = item.lokasi;
            document.getElementById('cabor').value = item.cabor;
            // We don't set time here since we want it to be real-time: document.getElementById('waktu').value = item.waktu;
            document.getElementById('kendala').value = item.kendala || '';
            document.getElementById('solusi').value = item.solusi || '';
            document.getElementById('rekomendasi').value = item.rekomendasi || '';

            // Clear all tables
            document.querySelector('#dataKasusTable tbody').innerHTML = '';
            document.querySelector('#penggunaanObatTable tbody').innerHTML = '';
            document.querySelector('#perlengkapanTable tbody').innerHTML = '';
            document.querySelector('#rujukanTable tbody').innerHTML = '';

            // Fill Kasus table
            if (Array.isArray(item.kasus_nama)) {
                for (let i = 0; i < item.kasus_nama.length; i++) {
                    if (item.kasus_nama[i]) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${i + 1}</td>
                            <td><input type="time" name="kasus_waktu[]" value="${item.kasus_waktu[i] || ''}"></td>
                            <td><input type="text" name="kasus_nama[]" value="${item.kasus_nama[i] || ''}"></td>
                            <td>
                                <select name="kasus_jk[]">
                                    <option value="L" ${(item.kasus_jk[i] === 'L') ? 'selected' : ''}>Laki-laki</option>
                                    <option value="P" ${(item.kasus_jk[i] === 'P') ? 'selected' : ''}>Perempuan</option>
                                </select>
                            </td>
                            <td><input type="text" name="kasus_keluhan[]" value="${item.kasus_keluhan[i] || ''}"></td>
                            <td><input type="text" name="kasus_penanganan[]" value="${item.kasus_penanganan[i] || ''}"></td>
                            <td><input type="text" name="kasus_hasil[]" value="${item.kasus_hasil[i] || ''}"></td>
                            <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
                        `;
                        document.querySelector('#dataKasusTable tbody').appendChild(row);
                    }
                }
            }

            // If no kasus data, add empty row
            if (document.querySelector('#dataKasusTable tbody').children.length === 0) {
                addTableRow('dataKasusTable', [
                    1,
                    '<input type="time" name="kasus_waktu[]">',
                    '<input type="text" name="kasus_nama[]">',
                    '<select name="kasus_jk[]"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select>',
                    '<input type="text" name="kasus_keluhan[]">',
                    '<input type="text" name="kasus_penanganan[]">',
                    '<input type="text" name="kasus_hasil[]">',
                    '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
                ]);
            }

            // Fill Obat table
            if (Array.isArray(item.obat_nama)) {
                for (let i = 0; i < item.obat_nama.length; i++) {
                    if (item.obat_nama[i]) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${i + 1}</td>
                            <td><input type="text" name="obat_nama[]" value="${item.obat_nama[i] || ''}"></td>
                            <td><input type="number" name="obat_awal[]" class="obat-awal" min="0" step="0.01" value="${item.obat_awal[i] || '0'}"></td>
                            <td><input type="number" name="obat_terpakai[]" class="obat-terpakai" min="0" step="0.01" value="${item.obat_terpakai[i] || '0'}"></td>
                            <td><input type="number" name="obat_sisa[]" class="obat-sisa" readonly step="0.01" value="${item.obat_sisa[i] || '0'}"></td>
                            <td><input type="text" name="obat_keterangan[]" value="${item.obat_keterangan ? item.obat_keterangan[i] || '' : ''}"></td>
                            <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
                        `;
                        document.querySelector('#penggunaanObatTable tbody').appendChild(row);
                    }
                }
            }

            // If no obat data, add empty row
            if (document.querySelector('#penggunaanObatTable tbody').children.length === 0) {
                addTableRow('penggunaanObatTable', [
                    1,
                    '<input type="text" name="obat_nama[]">',
                    '<input type="number" name="obat_awal[]" class="obat-awal" min="0" step="0.01">',
                    '<input type="number" name="obat_terpakai[]" class="obat-terpakai" min="0" step="0.01">',
                    '<input type="number" name="obat_sisa[]" class="obat-sisa" readonly step="0.01">',
                    '<input type="text" name="obat_keterangan[]">',
                    '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
                ]);
            }

            // Fill Perlengkapan table
            if (Array.isArray(item.perlengkapan_nama)) {
                for (let i = 0; i < item.perlengkapan_nama.length; i++) {
                    if (item.perlengkapan_nama[i]) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${i + 1}</td>
                            <td><input type="text" name="perlengkapan_nama[]" value="${item.perlengkapan_nama[i] || ''}"></td>
                            <td>
                                <select name="perlengkapan_awal[]">
                                    <option value="Baik" ${(item.perlengkapan_awal[i] === 'Baik') ? 'selected' : ''}>Baik</option>
                                    <option value="Cukup Baik" ${(item.perlengkapan_awal[i] === 'Cukup Baik') ? 'selected' : ''}>Cukup Baik</option>
                                    <option value="Kurang Baik" ${(item.perlengkapan_awal[i] === 'Kurang Baik') ? 'selected' : ''}>Kurang Baik</option>
                                    <option value="Rusak" ${(item.perlengkapan_awal[i] === 'Rusak') ? 'selected' : ''}>Rusak</option>
                                </select>
                            </td>
                            <td>
                                <select name="perlengkapan_akhir[]">
                                    <option value="Baik" ${(item.perlengkapan_akhir[i] === 'Baik') ? 'selected' : ''}>Baik</option>
                                    <option value="Cukup Baik" ${(item.perlengkapan_akhir[i] === 'Cukup Baik') ? 'selected' : ''}>Cukup Baik</option>
                                    <option value="Kurang Baik" ${(item.perlengkapan_akhir[i] === 'Kurang Baik') ? 'selected' : ''}>Kurang Baik</option>
                                    <option value="Rusak" ${(item.perlengkapan_akhir[i] === 'Rusak') ? 'selected' : ''}>Rusak</option>
                                </select>
                            </td>
                            <td><input type="text" name="perlengkapan_keterangan[]" value="${item.perlengkapan_keterangan[i] || ''}"></td>
                            <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
                        `;
                        document.querySelector('#perlengkapanTable tbody').appendChild(row);
                    }
                }
            }

            // If no perlengkapan data, add empty row
            if (document.querySelector('#perlengkapanTable tbody').children.length === 0) {
                addTableRow('perlengkapanTable', [
                    1,
                    '<input type="text" name="perlengkapan_nama[]">',
                    '<select name="perlengkapan_awal[]"><option value="Baik">Baik</option><option value="Cukup Baik">Cukup Baik</option><option value="Kurang Baik">Kurang Baik</option><option value="Rusak">Rusak</option></select>',
                    '<select name="perlengkapan_akhir[]"><option value="Baik">Baik</option><option value="Cukup Baik">Cukup Baik</option><option value="Kurang Baik">Kurang Baik</option><option value="Rusak">Rusak</option></select>',
                    '<input type="text" name="perlengkapan_keterangan[]">',
                    '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
                ]);
            }

            // Fill Rujukan table
            if (Array.isArray(item.rujukan_nama)) {
                for (let i = 0; i < item.rujukan_nama.length; i++) {
                    if (item.rujukan_nama[i]) {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${i + 1}</td>
                            <td><input type="text" name="rujukan_nama[]" value="${item.rujukan_nama[i] || ''}"></td>
                            <td><input type="text" name="rujukan_alasan[]" value="${item.rujukan_alasan[i] || ''}"></td>
                            <td><input type="text" name="rujukan_tujuan[]" value="${item.rujukan_tujuan[i] || ''}"></td>
                            <td><input type="time" name="rujukan_waktu[]" value="${item.rujukan_waktu[i] || ''}"></td>
                            <td><input type="text" name="rujukan_keterangan[]" value="${item.rujukan_keterangan[i] || ''}"></td>
                            <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
                        `;
                        document.querySelector('#rujukanTable tbody').appendChild(row);
                    }
                }
            }

            // If no rujukan data, add empty row
            if (document.querySelector('#rujukanTable tbody').children.length === 0) {
                addTableRow('rujukanTable', [
                    1,
                    '<input type="text" name="rujukan_nama[]">',
                    '<input type="text" name="rujukan_alasan[]">',
                    '<input type="text" name="rujukan_tujuan[]">',
                    '<input type="time" name="rujukan_waktu[]">',
                    '<input type="text" name="rujukan_keterangan[]">',
                    '<button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button>'
                ]);
            }

            // Load signature data for edit
            if (item.signaturePetugas) {
                document.getElementById('signatureDataPetugas').value = item.signaturePetugas;
                document.getElementById('signaturePreviewPetugas').innerHTML = `<img src="${item.signaturePetugas}" style="max-width: 100%; max-height: 100px;">`;
            }

            if (item.signatureKoordinator) {
                document.getElementById('signatureDataKoordinator').value = item.signatureKoordinator;
                document.getElementById('signaturePreviewKoordinator').innerHTML = `<img src="${item.signatureKoordinator}" style="max-width: 100%; max-height: 100px;">`;
            }

            // Set filenames if they exist
            if (item.signatureFilenamePetugas) {
                document.getElementById('signatureFilenamePetugas').value = item.signatureFilenamePetugas;
            }

            if (item.signatureFilenameKoordinator) {
                document.getElementById('signatureFilenameKoordinator').value = item.signatureFilenameKoordinator;
            }

            // Fill names and NIMs
            document.getElementById('namaPetugas').value = item.namaPetugas || '';
            document.getElementById('nimPetugas').value = item.nimPetugas || '';
            document.getElementById('namaKoordinator').value = item.namaKoordinator || '';
            document.getElementById('nimKoordinator').value = item.nimKoordinator || '';

            // Re-attach event listeners
            document.querySelectorAll('.delete-row-btn').forEach(button => {
                button.addEventListener('click', function () {
                    confirmDeleteRow(this);
                });
            });

            // Re-initialize sisa calculation
            addSisaCalculationEvents();

            // Start real-time clock if not already running
            startRealtimeClock();

            showToast(`Mengedit dokumentasi: ${item.cabor} - ${item.lokasi}`, 'info');
        } else {
            showToast('Data tidak ditemukan', 'error');
        }
    }

    // Basic form validation
    function validateForm() {
        const petugas = document.getElementById('petugas').value;
        const lokasi = document.getElementById('lokasi').value;
        const cabor = document.getElementById('cabor').value;

        // Check signatures
        const signatureDataPetugas = document.getElementById('signatureDataPetugas').value;
        const signatureDataKoordinator = document.getElementById('signatureDataKoordinator').value;

        if (!signatureDataPetugas) {
            showToast('Tanda tangan Petugas Medis diperlukan', 'error');
            return false;
        }

        if (!signatureDataKoordinator) {
            showToast('Tanda tangan Koordinator diperlukan', 'error');
            return false;
        }

        const namaPetugas = document.getElementById('namaPetugas').value;
        const nimPetugas = document.getElementById('nimPetugas').value;
        const namaKoordinator = document.getElementById('namaKoordinator').value;
        const nimKoordinator = document.getElementById('nimKoordinator').value;

        if (!namaPetugas || !nimPetugas || !namaKoordinator || !nimKoordinator) {
            showToast('Mohon lengkapi nama dan NIM untuk kedua penanda tangan', 'error');
            return false;
        }

        return petugas.trim() !== '' && lokasi.trim() !== '' && cabor.trim() !== '';
    }

    // Reset table to initial state with one empty row each
    function resetTableRows() {
        // Reset Kasus table
        document.querySelector('#dataKasusTable tbody').innerHTML = `
            <tr>
                <td>1</td>
                <td><input type="time" name="kasus_waktu[]"></td>
                <td><input type="text" name="kasus_nama[]"></td>
                <td>
                    <select name="kasus_jk[]">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </td>
                <td><input type="text" name="kasus_keluhan[]"></td>
                <td><input type="text" name="kasus_penanganan[]"></td>
                <td><input type="text" name="kasus_hasil[]"></td>
                <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;

        // Reset Obat table
        document.querySelector('#penggunaanObatTable tbody').innerHTML = `
            <tr>
                <td>1</td>
                <td><input type="text" name="obat_nama[]"></td>
                <td><input type="number" name="obat_awal[]" class="obat-awal" min="0" step="0.01"></td>
                <td><input type="number" name="obat_terpakai[]" class="obat-terpakai" min="0" step="0.01"></td>
                <td><input type="number" name="obat_sisa[]" class="obat-sisa" readonly step="0.01"></td>
                <td><input type="text" name="obat_keterangan[]"></td>
                <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;

        // Reset Perlengkapan table
        document.querySelector('#perlengkapanTable tbody').innerHTML = `
            <tr>
                <td>1</td>
                <td><input type="text" name="perlengkapan_nama[]"></td>
                <td>
                    <select name="perlengkapan_awal[]">
                        <option value="Baik">Baik</option>
                        <option value="Cukup Baik">Cukup Baik</option>
                        <option value="Kurang Baik">Kurang Baik</option>
                        <option value="Rusak">Rusak</option>
                    </select>
                </td>
                <td>
                    <select name="perlengkapan_akhir[]">
                        <option value="Baik">Baik</option>
                        <option value="Cukup Baik">Cukup Baik</option>
                        <option value="Kurang Baik">Kurang Baik</option>
                        <option value="Rusak">Rusak</option>
                    </select>
                </td>
                <td><input type="text" name="perlengkapan_keterangan[]"></td>
                <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;

        // Reset Rujukan table
        document.querySelector('#rujukanTable tbody').innerHTML = `
            <tr>
                <td>1</td>
                <td><input type="text" name="rujukan_nama[]"></td>
                <td><input type="text" name="rujukan_alasan[]"></td>
                <td><input type="text" name="rujukan_tujuan[]"></td>
                <td><input type="time" name="rujukan_waktu[]"></td>
                <td><input type="text" name="rujukan_keterangan[]"></td>
                <td><button type="button" class="delete-row-btn"><i class="fas fa-trash"></i></button></td>
            </tr>
        `;

        // Clear signatures
        document.getElementById('signaturePreviewPetugas').innerHTML = '<span class="no-signature-text">Belum ada tanda tangan</span>';
        document.getElementById('signaturePreviewKoordinator').innerHTML = '<span class="no-signature-text">Belum ada tanda tangan</span>';
        document.getElementById('signatureDataPetugas').value = '';
        document.getElementById('signatureDataKoordinator').value = '';
        document.getElementById('signatureFilenamePetugas').value = '';
        document.getElementById('signatureFilenameKoordinator').value = '';

        // Clear names and NIMs
        document.getElementById('namaPetugas').value = '';
        document.getElementById('nimPetugas').value = '';
        document.getElementById('namaKoordinator').value = '';
        document.getElementById('nimKoordinator').value = '';

        // Re-attach event listeners
        document.querySelectorAll('.delete-row-btn').forEach(button => {
            button.addEventListener('click', function () {
                confirmDeleteRow(this);
            });
        });

        // Re-initialize sisa calculation
        addSisaCalculationEvents();
    }

    // Generate PDF
    document.getElementById('generatePDF').addEventListener('click', function () {
        // Create form data object with current form values
        const formData = {
            petugas: document.getElementById('petugas').value,
            tanggal: document.getElementById('tanggal').value,
            lokasi: document.getElementById('lokasi').value,
            cabor: document.getElementById('cabor').value,
            waktu: document.getElementById('waktu').value,
            kendala: document.getElementById('kendala').value,
            solusi: document.getElementById('solusi').value,
            rekomendasi: document.getElementById('rekomendasi').value,

            // Collect kasus data
            kasus_nama: [],
            kasus_waktu: [],
            kasus_jk: [],
            kasus_keluhan: [],
            kasus_penanganan: [],
            kasus_hasil: [],

            // Collect obat data
            obat_nama: [],
            obat_awal: [],
            obat_terpakai: [],
            obat_sisa: [],
            obat_keterangan: [],

            // Collect perlengkapan data
            perlengkapan_nama: [],
            perlengkapan_awal: [],
            perlengkapan_akhir: [],
            perlengkapan_keterangan: [],

            // Collect rujukan data
            rujukan_nama: [],
            rujukan_alasan: [],
            rujukan_tujuan: [],
            rujukan_waktu: [],
            rujukan_keterangan: [],

            // Get signatures and names
            signaturePetugas: document.getElementById('signatureDataPetugas').value,
            signatureKoordinator: document.getElementById('signatureDataKoordinator').value,
            namaPetugas: document.getElementById('namaPetugas').value,
            nimPetugas: document.getElementById('nimPetugas').value,
            namaKoordinator: document.getElementById('namaKoordinator').value,
            nimKoordinator: document.getElementById('nimKoordinator').value
        };

        // Collect table data
        document.querySelectorAll('#dataKasusTable tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[2].querySelector('input').value.trim() !== '') {
                formData.kasus_waktu.push(cells[1].querySelector('input').value);
                formData.kasus_nama.push(cells[2].querySelector('input').value);
                formData.kasus_jk.push(cells[3].querySelector('select').value);
                formData.kasus_keluhan.push(cells[4].querySelector('input').value);
                formData.kasus_penanganan.push(cells[5].querySelector('input').value);
                formData.kasus_hasil.push(cells[6].querySelector('input').value);
            }
        });

        document.querySelectorAll('#penggunaanObatTable tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[1].querySelector('input').value.trim() !== '') {
                formData.obat_nama.push(cells[1].querySelector('input').value);
                formData.obat_awal.push(cells[2].querySelector('input').value);
                formData.obat_terpakai.push(cells[3].querySelector('input').value);
                formData.obat_sisa.push(cells[4].querySelector('input').value);
                formData.obat_keterangan.push(cells[5].querySelector('input').value);
            }
        });

        document.querySelectorAll('#perlengkapanTable tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[1].querySelector('input').value.trim() !== '') {
                formData.perlengkapan_nama.push(cells[1].querySelector('input').value);
                formData.perlengkapan_awal.push(cells[2].querySelector('select').value);
                formData.perlengkapan_akhir.push(cells[3].querySelector('select').value);
                formData.perlengkapan_keterangan.push(cells[4].querySelector('input').value);
            }
        });

        document.querySelectorAll('#rujukanTable tbody tr').forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells[1].querySelector('input').value.trim() !== '') {
                formData.rujukan_nama.push(cells[1].querySelector('input').value);
                formData.rujukan_alasan.push(cells[2].querySelector('input').value);
                formData.rujukan_tujuan.push(cells[3].querySelector('input').value);
                formData.rujukan_waktu.push(cells[4].querySelector('input').value);
                formData.rujukan_keterangan.push(cells[5].querySelector('input').value);
            }
        });

        // Generate PDF using the same function
        generatePDFFromData(formData);
        showToast('PDF berhasil diunduh', 'success');
    });

    // Modify your updateDashboard function to include the chart generation
    function updateDashboard() {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];

        // Update total dokumentasi
        document.querySelector('.dashboard-card:nth-child(1) .card-value').textContent = savedData.length;

        // Count today's cases from all kasus data
        const today = new Date().toISOString().split('T')[0];
        let todayCasesCount = 0;
        savedData.forEach(item => {
            if (item.tanggal === today && Array.isArray(item.kasus_nama)) {
                // Count non-empty kasus entries for today
                todayCasesCount += item.kasus_nama.filter(nama => nama && nama.trim() !== '').length;
            }
        });
        document.querySelector('.dashboard-card:nth-child(2) .card-value').textContent = todayCasesCount;

        // Count rujukan
        let rujukanCount = 0;
        savedData.forEach(item => {
            if (item.rujukan_nama && Array.isArray(item.rujukan_nama)) {
                rujukanCount += item.rujukan_nama.filter(name => name && name.trim() !== '').length;
            }
        });
        document.querySelector('.dashboard-card:nth-child(3) .card-value').textContent = rujukanCount;

        // Count unique cabang olahraga
        const uniqueCabor = new Set();
        savedData.forEach(item => {
            if (item.cabor && typeof item.cabor === 'string') {
                const normalizedCabor = item.cabor.trim().toLowerCase();
                if (normalizedCabor) {
                    uniqueCabor.add(normalizedCabor);
                }
            }
        });
        document.querySelector('.dashboard-card:nth-child(4) .card-value').textContent = uniqueCabor.size;

        // Update recent activities
        const recentActivities = document.getElementById('recent-activities');
        recentActivities.innerHTML = '';

        // Get recent activities
        const recentActs = JSON.parse(localStorage.getItem('recentActivities') || '[]');

        if (recentActs.length === 0) {
            recentActivities.innerHTML = '<div class="history-item">Belum ada aktivitas terbaru</div>';
        } else {
            recentActs.forEach(item => {
                const activityDate = formatDateIndonesia(item.tanggal);
                const div = document.createElement('div');
                div.className = 'history-item';
                div.innerHTML = `<strong>${activityDate} ${item.waktu}</strong> - ${item.petugas} ${item.actionText} kegiatan ${item.cabor} di ${item.lokasi}`;
                recentActivities.appendChild(div);
            });
        }

        // Generate the chart (after a small delay to ensure DOM is ready)
        setTimeout(generateDailyChart, 100);
    }

    // Update history
    function updateHistory() {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
        const historyList = document.getElementById('history-list');
        historyList.innerHTML = '';

        if (savedData.length === 0) {
            historyList.innerHTML = '<div class="history-item">Belum ada riwayat dokumentasi</div>';
            return;
        }

        // Sort data by date and time in descending order
        const sortedData = [...savedData].sort((a, b) => {
            const dateA = new Date(a.tanggal + 'T' + a.waktu);
            const dateB = new Date(b.tanggal + 'T' + b.waktu);
            return dateB - dateA;
        });

        // Create history items
        sortedData.forEach(item => {
            const historyDate = formatDateIndonesia(item.tanggal);
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <h3>${item.cabor} - ${item.lokasi}</h3>
                <p><strong>Tanggal:</strong> ${historyDate} | <strong>Petugas:</strong> ${item.petugas}</p>
                <div class="history-actions">
                    <button class="view-btn" data-id="${item.id}"><i class="fas fa-eye"></i> Lihat Detail</button>
                    <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i> Edit</button>
                    <button class="download-btn" data-id="${item.id}"><i class="fas fa-download"></i> Unduh PDF</button>
                    <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i> Hapus</button>
                </div>
            `;
            historyList.appendChild(div);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function () {
                viewItemDetail(parseInt(this.dataset.id));
            });
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', function () {
                editItem(parseInt(this.dataset.id));
            });
        });

        document.querySelectorAll('.download-btn').forEach(button => {
            button.addEventListener('click', function () {
                const id = parseInt(this.dataset.id);
                const item = sortedData.find(doc => doc.id === id);
                if (item) {
                    generatePDFFromData(item);
                    showToast('PDF berhasil diunduh', 'success');
                }
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function () {
                confirmDeleteItem(parseInt(this.dataset.id));
            });
        });
    }

    // Function to view item detail in modal
    function viewItemDetail(id) {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
        const item = savedData.find(doc => doc.id === id);

        if (item) {
            const detailContent = document.getElementById('detailContent');
            const formattedDate = formatDateIndonesia(item.tanggal);

            let html = `
                <div class="detail-header">
                    <h3>${item.cabor} - ${item.lokasi}</h3>
                    <p><strong>Tanggal&emsp; :</strong> ${formattedDate}</p>
                    <p><strong>Petugas&emsp;:</strong> ${item.petugas}</p>
                    <p><strong>Waktu&emsp;&emsp;:</strong> ${item.waktu}</p>
                </div>
            `;

            // Kasus data
            if (Array.isArray(item.kasus_nama) && item.kasus_nama.some(name => name && name.trim() !== '')) {
                html += `<h4><i class="fas fa-user-injured"></i> Data Kasus</h4>`;
                html += `<div class="table-container"><table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Waktu</th>
                            <th>Nama Pasien</th>
                            <th>Jenis Kelamin</th>
                            <th>Keluhan</th>
                            <th>Penanganan</th>
                            <th>Hasil</th>
                        </tr>
                    </thead>
                    <tbody>`;

                for (let i = 0; i < item.kasus_nama.length; i++) {
                    if (item.kasus_nama[i] && item.kasus_nama[i].trim() !== '') {
                        html += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.kasus_waktu ? item.kasus_waktu[i] || '-' : '-'}</td>
                            <td>${item.kasus_nama[i] || '-'}</td>
                            <td>${item.kasus_jk ? (item.kasus_jk[i] === 'L' ? 'Laki-laki' : 'Perempuan') : '-'}</td>
                            <td>${item.kasus_keluhan ? item.kasus_keluhan[i] || '-' : '-'}</td>
                            <td>${item.kasus_penanganan ? item.kasus_penanganan[i] || '-' : '-'}</td>
                            <td>${item.kasus_hasil ? item.kasus_hasil[i] || '-' : '-'}</td>
                        </tr>`;
                    }
                }

                html += `</tbody></table></div>`;
            } else {
                html += `<h4><i class="fas fa-user-injured"></i> Data Kasus</h4>`;
                html += `<p>Tidak ada data kasus.</p>`;
            }

            // Obat data
            if (Array.isArray(item.obat_nama) && item.obat_nama.some(name => name && name.trim() !== '')) {
                html += `<h4><i class="fas fa-pills"></i> Penggunaan Obat & Alat Medis</h4>`;
                html += `<div class="table-container"><table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Item</th>
                            <th>Jumlah Awal</th>
                            <th>Jumlah Terpakai</th>
                            <th>Sisa</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>`;

                for (let i = 0; i < item.obat_nama.length; i++) {
                    if (item.obat_nama[i] && item.obat_nama[i].trim() !== '') {
                        html += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.obat_nama[i] || '-'}</td>
                            <td>${item.obat_awal ? item.obat_awal[i] || '-' : '-'}</td>
                            <td>${item.obat_terpakai ? item.obat_terpakai[i] || '-' : '-'}</td>
                            <td>${item.obat_sisa ? item.obat_sisa[i] || '-' : '-'}</td>
                            <td>${item.obat_keterangan ? item.obat_keterangan[i] || '-' : '-'}</td>
                        </tr>`;
                    }
                }

                html += `</tbody></table></div>`;
            } else {
                html += `<h4><i class="fas fa-pills"></i> Penggunaan Obat & Alat Medis</h4>`;
                html += `<p>Tidak ada data penggunaan obat & alat medis.</p>`;
            }

            // Perlengkapan data
            if (Array.isArray(item.perlengkapan_nama) && item.perlengkapan_nama.some(name => name && name.trim() !== '')) {
                html += `<h4><i class="fas fa-toolbox"></i> Catatan Perlengkapan dan Alat Medis</h4>`;
                html += `<div class="table-container"><table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Perlengkapan</th>
                            <th>Kondisi Awal</th>
                            <th>Kondisi Akhir</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>`;

                for (let i = 0; i < item.perlengkapan_nama.length; i++) {
                    if (item.perlengkapan_nama[i] && item.perlengkapan_nama[i].trim() !== '') {
                        html += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.perlengkapan_nama[i] || '-'}</td>
                            <td>${item.perlengkapan_awal ? item.perlengkapan_awal[i] || '-' : '-'}</td>
                            <td>${item.perlengkapan_akhir ? item.perlengkapan_akhir[i] || '-' : '-'}</td>
                            <td>${item.perlengkapan_keterangan ? item.perlengkapan_keterangan[i] || '-' : '-'}</td>
                        </tr>`;
                    }
                }

                html += `</tbody></table></div>`;
            } else {
                html += `<h4><i class="fas fa-toolbox"></i> Catatan Perlengkapan dan Alat Medis</h4>`;
                html += `<p>Tidak ada data perlengkapan.</p>`;
            }

            // Rujukan data
            if (Array.isArray(item.rujukan_nama) && item.rujukan_nama.some(name => name && name.trim() !== '')) {
                html += `<h4><i class="fas fa-ambulance"></i> Rujukan Medis</h4>`;
                html += `<div class="table-container"><table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Nama Pasien</th>
                            <th>Alasan Rujukan</th>
                            <th>Fasilitas Kesehatan</th>
                            <th>Waktu</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>`;

                for (let i = 0; i < item.rujukan_nama.length; i++) {
                    if (item.rujukan_nama[i] && item.rujukan_nama[i].trim() !== '') {
                        html += `<tr>
                            <td>${i + 1}</td>
                            <td>${item.rujukan_nama[i] || '-'}</td>
                            <td>${item.rujukan_alasan ? item.rujukan_alasan[i] || '-' : '-'}</td>
                            <td>${item.rujukan_tujuan ? item.rujukan_tujuan[i] || '-' : '-'}</td>
                            <td>${item.rujukan_waktu ? item.rujukan_waktu[i] || '-' : '-'}</td>
                            <td>${item.rujukan_keterangan ? item.rujukan_keterangan[i] || '-' : '-'}</td>
                        </tr>`;
                    }
                }

                html += `</tbody></table></div>`;
            } else {
                html += `<h4><i class="fas fa-ambulance"></i> Rujukan Medis</h4>`;
                html += `<p>Tidak ada data rujukan.</p>`;
            }

            // Evaluasi
            html += `<h4><i class="fas fa-clipboard-check"></i> Evaluasi Kegiatan</h4>`;
            html += `
                <div class="detail-evaluasi">
                    <h5>Kendala yang Dihadapi:</h5>
                    <p>${item.kendala || '-'}</p>
                    
                    <h5>Solusi yang Dilakukan:</h5>
                    <p>${item.solusi || '-'}</p>
                    
                    <h5>Rekomendasi untuk Kegiatan Selanjutnya:</h5>
                    <p>${item.rekomendasi || '-'}</p>
                </div>
            `;

            // Signatures
            html += `
                <h4><i class="fas fa-signature"></i> Tanda Tangan</h4>
                <div class="signatures-detail" style="display: flex; flex-wrap: wrap; gap: 20px; margin-top: 10px;">
                    <div style="flex: 1; min-width: 200px;">
                        <h5>Petugas Medis:</h5>
                        ${item.signaturePetugas ?
                    `<img src="${item.signaturePetugas}" style="max-width: 200px; border: 1px solid #ddd;">` :
                    '<p>Tidak ada tanda tangan</p>'}
                        <p><strong>Nama:</strong> ${item.namaPetugas || '-'}</p>
                        <p><strong>NIM:</strong> ${item.nimPetugas || '-'}</p>
                        ${item.signatureFilenamePetugas ?
                    `<p><strong>File:</strong> ${item.signatureFilenamePetugas}</p>` : ''}
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <h5>Koordinator:</h5>
                        ${item.signatureKoordinator ?
                    `<img src="${item.signatureKoordinator}" style="max-width: 200px; border: 1px solid #ddd;">` :
                    '<p>Tidak ada tanda tangan</p>'}
                        <p><strong>Nama:</strong> ${item.namaKoordinator || '-'}</p>
                        <p><strong>NIM:</strong> ${item.nimKoordinator || '-'}</p>
                        ${item.signatureFilenameKoordinator ?
                    `<p><strong>File:</strong> ${item.signatureFilenameKoordinator}</p>` : ''}
                    </div>
                </div>
            `;

            detailContent.innerHTML = html;
            openModal('detailModal');
        } else {
            showToast('Data tidak ditemukan', 'error');
        }
    }

    // Function to confirm delete item
    function confirmDeleteItem(id) {
        const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
        const item = savedData.find(doc => doc.id === id);

        if (item) {
            document.getElementById('confirmMessage').textContent = `Apakah Anda yakin ingin menghapus dokumentasi "${item.cabor} - ${item.lokasi}"?`;

            // Set up confirm modal buttons
            document.getElementById('confirmAction').onclick = function () {
                // Add to recent activities before deleting
                item.action = 'delete';
                item.actionText = 'menghapus';
                item.date = new Date().toISOString(); // Update timestamp

                // Get recent activities
                let recentActs = JSON.parse(localStorage.getItem('recentActivities') || '[]');
                recentActs.unshift(item);
                recentActs = recentActs.slice(0, 5); // Keep only last 5
                localStorage.setItem('recentActivities', JSON.stringify(recentActs));

                const updatedData = savedData.filter(doc => doc.id !== id);
                localStorage.setItem('medicalDocuments', JSON.stringify(updatedData));

                closeModal(document.getElementById('confirmModal'));
                showToast('Dokumentasi berhasil dihapus', 'success');

                updateDashboard();
                updateHistory();
            };

            document.getElementById('cancelAction').onclick = function () {
                closeModal(document.getElementById('confirmModal'));
            };

            openModal('confirmModal');
        } else {
            showToast('Data tidak ditemukan', 'error');
        }
    }

    // Generate PDF from stored data
    function generatePDFFromData(data) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let currentY = 0;

        // Set page margins (in mm)
        const margin = {
            left: 25,
            right: 25,
            top: 20
        };
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const contentWidth = pageWidth - margin.left - margin.right;

        // Helper function to check page break
        function checkNewPage(neededSpace = 20) {
            if (currentY + neededSpace > pageHeight - margin.top) {
                doc.addPage();
                currentY = margin.top;
                return true;
            }
            return false;
        }

        // Set initial font
        doc.setFont("times", "normal");
        doc.setFontSize(16);

        // Header
        currentY = margin.top;
        doc.text("DOKUMENTASI & ADMINISTRASI TIM MEDIC", pageWidth / 2, currentY, { align: 'center' });

        // Basic information
        doc.setFontSize(12);
        currentY = margin.top + 20;

        // Form data with aligned layout
        const labelPos = margin.left;
        const colonPos = margin.left + 34;
        const valuePos = margin.left + 40;

        function drawFormField(label, value, spacing = 8) {
            checkNewPage(spacing);
            doc.text(label, labelPos, currentY);
            doc.text(":", colonPos, currentY);
            doc.text(value || "-", valuePos, currentY);
            currentY += spacing;
        }

        drawFormField("Nama Petugas", data.petugas);
        drawFormField("Tanggal", formatDateIndonesia(data.tanggal));
        drawFormField("Lokasi Kegiatan", data.lokasi);
        drawFormField("Cabang Olahraga", data.cabor);
        drawFormField("Waktu", data.waktu);

        // Data Kasus table
        currentY += 5;
        doc.text("DATA KASUS", margin.left, currentY);

        const kasusData = [];
        if (Array.isArray(data.kasus_nama)) {
            for (let i = 0; i < data.kasus_nama.length; i++) {
                if (data.kasus_nama[i] && data.kasus_nama[i].trim() !== '') {
                    kasusData.push([
                        i + 1,
                        data.kasus_waktu[i] || '-',
                        data.kasus_nama[i] || '-',
                        data.kasus_jk[i] || '-',
                        data.kasus_keluhan[i] || '-',
                        data.kasus_penanganan[i] || '-',
                        data.kasus_hasil[i] || '-'
                    ]);
                }
            }
        }

        doc.autoTable({
            startY: currentY + 5,
            head: [['No', 'Waktu', 'Nama Pasien', 'JK', 'Keluhan', 'Penanganan', 'Hasil']],
            body: kasusData,
            theme: 'grid',
            styles: { font: 'times', fontSize: 10 },
            margin: { left: margin.left, right: margin.right }
        });

        // Penggunaan Obat table
        currentY = doc.lastAutoTable.finalY + 10;
        doc.text("PENGGUNAAN OBAT & ALAT MEDIS", margin.left, currentY);

        const obatData = [];
        if (Array.isArray(data.obat_nama)) {
            for (let i = 0; i < data.obat_nama.length; i++) {
                if (data.obat_nama[i] && data.obat_nama[i].trim() !== '') {
                    obatData.push([
                        i + 1,
                        data.obat_nama[i] || '-',
                        data.obat_awal[i] || '-',
                        data.obat_terpakai[i] || '-',
                        data.obat_sisa[i] || '-',
                        data.obat_keterangan[i] || '-'
                    ]);
                }
            }
        }

        doc.autoTable({
            startY: currentY + 5,
            head: [['No', 'Nama Item', 'Jumlah Awal', 'Terpakai', 'Sisa', 'Keterangan']],
            body: obatData,
            theme: 'grid',
            styles: { font: 'times', fontSize: 10 },
            margin: { left: margin.left, right: margin.right }
        });

        // Perlengkapan table
        currentY = doc.lastAutoTable.finalY + 10;
        doc.text("CATATAN PERLENGKAPAN DAN ALAT MEDIS", margin.left, currentY);

        const perlengkapanData = [];
        if (Array.isArray(data.perlengkapan_nama)) {
            for (let i = 0; i < data.perlengkapan_nama.length; i++) {
                if (data.perlengkapan_nama[i] && data.perlengkapan_nama[i].trim() !== '') {
                    perlengkapanData.push([
                        i + 1,
                        data.perlengkapan_nama[i] || '-',
                        data.perlengkapan_awal[i] || '-',
                        data.perlengkapan_akhir[i] || '-',
                        data.perlengkapan_keterangan[i] || '-'
                    ]);
                }
            }
        }

        doc.autoTable({
            startY: currentY + 5,
            head: [['No', 'Nama Perlengkapan', 'Kondisi Awal', 'Kondisi Akhir', 'Keterangan']],
            body: perlengkapanData,
            theme: 'grid',
            styles: { font: 'times', fontSize: 10 },
            margin: { left: margin.left, right: margin.right }
        });

        // Rujukan table
        currentY = doc.lastAutoTable.finalY + 10;
        doc.text("RUJUKAN MEDIS", margin.left, currentY);

        const rujukanData = [];
        if (Array.isArray(data.rujukan_nama)) {
            for (let i = 0; i < data.rujukan_nama.length; i++) {
                if (data.rujukan_nama[i] && data.rujukan_nama[i].trim() !== '') {
                    rujukanData.push([
                        i + 1,
                        data.rujukan_nama[i] || '-',
                        data.rujukan_alasan[i] || '-',
                        data.rujukan_tujuan[i] || '-',
                        data.rujukan_waktu[i] || '-',
                        data.rujukan_keterangan[i] || '-'
                    ]);
                }
            }
        }

        doc.autoTable({
            startY: currentY + 5,
            head: [['No', 'Nama Pasien', 'Alasan', 'Tujuan', 'Waktu', 'Keterangan']],
            body: rujukanData,
            theme: 'grid',
            styles: { font: 'times', fontSize: 10 },
            margin: { left: margin.left, right: margin.right }
        });

        // Evaluasi section
        currentY = doc.lastAutoTable.finalY + 10;
        checkNewPage(40);
        doc.text("EVALUASI KEGIATAN", margin.left, currentY);
        currentY += 10;

        // Kendala
        doc.text("Kendala yang Dihadapi:", margin.left, currentY);
        currentY += 7;
        doc.text(data.kendala || "-", margin.left + 5, currentY);
        currentY += 15;

        // Solusi
        checkNewPage(30);
        doc.text("Solusi yang Dilakukan:", margin.left, currentY);
        currentY += 7;
        doc.text(data.solusi || "-", margin.left + 5, currentY);
        currentY += 15;

        // Rekomendasi
        checkNewPage(30);
        doc.text("Rekomendasi untuk Kegiatan Selanjutnya:", margin.left, currentY);
        currentY += 7;
        doc.text(data.rekomendasi || "-", margin.left + 5, currentY);
        currentY += 20;

        // Check if new page needed for signatures
        checkNewPage(60);

        // Signature section
        currentY += 10;
        const leftSignX = margin.left + 15;
        const rightSignX = pageWidth - margin.right - 70;

        doc.text("Petugas Medis", leftSignX, currentY);
        doc.text("Koordinator", rightSignX, currentY);
        currentY += 10;

        // Add signatures
        if (data.signaturePetugas) {
            doc.addImage(data.signaturePetugas, 'PNG', margin.left, currentY, 70, 30);
        }
        if (data.signatureKoordinator) {
            doc.addImage(data.signatureKoordinator, 'PNG', rightSignX - 15, currentY, 70, 30);
        }

        // Add names and NIMs
        currentY += 35;
        doc.setFontSize(12);
        doc.text(data.namaPetugas || "________________", leftSignX, currentY);
        doc.text(data.namaKoordinator || "________________", rightSignX, currentY);
        currentY += 5;
        doc.text(data.nimPetugas ? `NIM: ${data.nimPetugas}` : "NIM: ____________", leftSignX, currentY);
        doc.text(data.nimKoordinator ? `NIM: ${data.nimKoordinator}` : "NIM: ____________", rightSignX, currentY);

        // Save PDF
        doc.save(`Dokumentasi_Tim_Medis_${data.tanggal}_${data.cabor}.pdf`);
    }

    // Initialize dashboard and history
    updateDashboard();
    updateHistory();
});

// Create signature modal HTML
document.addEventListener('DOMContentLoaded', function () {
    // Append the signature modal HTML if it doesn't exist
    if (!document.getElementById('signatureModal')) {
        const modalHTML = `
        <div class="modal-overlay" id="signatureModal">
            <div class="modal">
                <div class="modal-header">
                    <h3><i class="fas fa-signature"></i> <span id="signatureModalTitle">Tanda Tangan</span></h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="signature-pad-container" style="border: 1px solid #ccc; border-radius: 4px; margin-bottom: 10px;">
                        <canvas id="signatureModalCanvas" style="width: 100%; height: 200px;"></canvas>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <button type="button" class="btn-warning" id="clearModalSignature">
                            <i class="fas fa-eraser"></i> Hapus
                        </button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="cancelSignature" class="btn">Batal</button>
                    <button id="saveSignature" class="btn btn-success">Simpan Tanda Tangan</button>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
});

// Add this CSS right after your existing modal-related CSS in the document
document.addEventListener('DOMContentLoaded', function () {
    // Add specific styling for the close button in modals
    const style = document.createElement('style');
    style.textContent = `
        .modal-header .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            padding: 0;
            margin: 0;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            flex: 0 0 auto;
        }
        
        /* Make the button more touch-friendly but still compact */
        @media screen and (max-width: 768px) {
            .modal-header .close-modal {
                width: 40px;
                height: 40px;
                line-height: 40px;
                font-size: 20px;
            }
            
            /* Make sure the modal header properly aligns items */
            .modal-header {
                justify-content: space-between;
                align-items: center;
            }
        }
    `;
    document.head.appendChild(style);
});

// Set the copyright year to the current year
document.addEventListener('DOMContentLoaded', function () {
    const currentYear = new Date().getFullYear();
    document.getElementById('copyright').innerHTML = `&copy; ${currentYear} PANDU KAYA HAKIKI. All rights reserved.`;
});

// Add this function to your JavaScript file
function generateDailyChart() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }
    
    // Check if canvas exists
    const canvas = document.getElementById('casesChart');
    if (!canvas) {
        console.error('Canvas element for chart not found');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const savedData = JSON.parse(localStorage.getItem('medicalDocuments')) || [];
    
    // Extract only dates that have actual data
    const casesByDate = {};
    
    // Collect all dates with data
    savedData.forEach(item => {
        if (item.tanggal && Array.isArray(item.kasus_nama)) {
            const casesCount = item.kasus_nama.filter(nama => nama && nama.trim() !== '').length;
            if (casesCount > 0) {
                // If this date already exists, add to its count
                if (casesByDate[item.tanggal]) {
                    casesByDate[item.tanggal] += casesCount;
                } else {
                    casesByDate[item.tanggal] = casesCount;
                }
            }
        }
    });
    
    // Convert to array of [date, count] pairs and sort by date
    const dateEntries = Object.entries(casesByDate)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]));
    
    // If no data, show a message instead of an empty chart
    if (dateEntries.length === 0) {
        // Display a message in the chart container
        const chartContainer = document.querySelector('.chart-container');
        if (chartContainer) {
            chartContainer.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; color: #666; font-style: italic;">
                    <p>Belum ada data kasus untuk ditampilkan</p>
                </div>
            `;
        }
        return;
    }
    
    // Prepare data for chart
    const dates = dateEntries.map(entry => entry[0]);
    const chartData = dateEntries.map(entry => entry[1]);
    
    // Format date labels as DD/MM
    const labels = dates.map(dateStr => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${day}/${month}`;
    });
    
    console.log('Chart data:', {dates, labels, chartData}); // Debug output
    
    try {
        // Clear previous chart if it exists
        if (window.casesChartInstance) {
            window.casesChartInstance.destroy();
        }
        
        // Create chart
        window.casesChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Kasus',
                    data: chartData,
                    backgroundColor: 'rgba(26, 159, 178, 0.2)',
                    borderColor: '#1A9FB2',
                    borderWidth: 2,
                    pointBackgroundColor: '#1A9FB2',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#1A9FB2',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        titleFont: {
                            size: 14
                        },
                        bodyFont: {
                            size: 14
                        },
                        callbacks: {
                            label: function(context) {
                                return `Jumlah Kasus: ${context.parsed.y}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        console.log('Chart successfully created');
    } catch (error) {
        console.error('Error creating chart:', error);
    }
}

// Make sure chart is re-generated when switching to dashboard tab
document.addEventListener('DOMContentLoaded', function() {
    const dashboardLink = document.querySelector('.nav-link[data-target="dashboard"]');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', function() {
            // Slight delay to ensure the dashboard is visible
            setTimeout(generateDailyChart, 100);
        });
    }
});

// Directly after the DOM content loaded event
document.addEventListener('DOMContentLoaded', function() {
    // Test if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded. Loading it now...');
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = function() {
            console.log('Chart.js loaded successfully');
            // Initialize once loaded
            updateDashboard();
        };
        document.head.appendChild(script);
    } else {
        console.log('Chart.js already loaded');
    }
});
