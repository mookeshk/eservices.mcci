const defaultDocData = {
    companyName: "شركة ديار الإعمار العالمية للمقاولات العامة",
    chamberName: "غرفة المدينة المنورة",
    unifiedNumber: "7039742783",
    idNumber: "1234567890",
    requestNumber: "13533341",
    requestType: "طلب مفتوح",
    applicantName: "طارق دك أسد زنون",
    creationDate: "07/25/2026 - 6:31 م",
    expiryDate: "10/23/2026 - 6:31 م",
    status: "تم قبول الطلب وساري",
    amount: "35 ريال",
    crNumber: "4650286731",
    secondParty: "محمد كمال محمد علي المليجي",
    companyEn: "Diyar Al Aamaar Al Aalamiyyah Company",
    creatorAr: "طارق طه احمد زنون",
    creatorEn: "Tariq Taha Ahmed Zanoun",
    dateHijri: "1448/2/11 هـ",
    dateEn: "25-07-2026",
    qrLink: "https://eservices.mcci.org.sa/#/DocumentVerify"
};

document.addEventListener('DOMContentLoaded', () => {
    const step1Actions = document.getElementById('step1Actions');
    const step2Actions = document.getElementById('step2Actions');
    const step3 = document.getElementById('step3');
    const formContainer = document.getElementById('formContainer');
    const instructionText = document.getElementById('instructionText');

    const captchaBox = document.getElementById('captchaBox');
    const captchaCheckboxBox = document.getElementById('captchaCheckboxBox');
    const recaptchaOverlay = document.getElementById('recaptchaOverlay');
    const recaptchaGrid = document.getElementById('recaptchaGrid');
    const btnRecaptchaVerify = document.getElementById('btnRecaptchaVerify');
    
    const btnNext = document.getElementById('btnNext');
    const btnQuery = document.getElementById('btnQuery');
    
    const refNumGroup = document.getElementById('refNumGroup');
    const referenceNumberInput = document.getElementById('referenceNumber');
    const displayRefNumber = document.getElementById('displayRefNumber');
    const refError = document.getElementById('refError');
    
    const verifyInput = document.getElementById('verifyInput');
    const verifyError = document.getElementById('verifyError');
    const radioInputs = document.querySelectorAll('input[name="verifyMethod"]');

    // Load Admin Data if on Admin Page
    if (window.location.pathname.includes('admin.html')) {
        const data = JSON.parse(localStorage.getItem('docData')) || defaultDocData;
        
        // Helper to safely set value
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };

        // Step 3 basic data
        setVal('adminCompanyName', data.companyName);
        setVal('adminChamberName', data.chamberName);
        setVal('adminUnifiedNumber', data.unifiedNumber);
        setVal('adminIdNumber', data.idNumber || '1234567890');
        setVal('adminRequestNumber', data.requestNumber);
        setVal('adminRequestType', data.requestType);
        setVal('adminCrNumber', data.crNumber);
        setVal('adminApplicantName', data.applicantName);
        setVal('adminCreationDate', data.creationDate);
        setVal('adminExpiryDate', data.expiryDate);
        setVal('adminStatus', data.status);
        setVal('adminAmount', data.amount);
        
        // Print-specific data
        setVal('adminSecondParty', data.secondParty || defaultDocData.secondParty);
        setVal('adminCompanyEn', data.companyEn || defaultDocData.companyEn);
        setVal('adminCreatorAr', data.creatorAr || defaultDocData.creatorAr);
        setVal('adminCreatorEn', data.creatorEn || defaultDocData.creatorEn);
        setVal('adminDateHijri', data.dateHijri || defaultDocData.dateHijri);
        setVal('adminDateEn', data.dateEn || defaultDocData.dateEn);
        setVal('adminQrLink', data.qrLink || "https://eservices.mcci.org.sa/#/DocumentVerify");
    }

    // Populate data for step 3 and Print if we are on index.html
    const resCompanyName = document.getElementById('resCompanyName');
    if (resCompanyName) {
        const data = JSON.parse(localStorage.getItem('docData')) || defaultDocData;
        
        // Helper to safely set text content
        const setText = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.textContent = val;
        };

        // Populate Result Screen
        setText('resCompanyName', data.companyName);
        setText('resChamberName', data.chamberName);
        setText('resUnifiedNumber', data.unifiedNumber);
        setText('resRequestNumber', data.requestNumber);
        setText('resRequestType', data.requestType);
        setText('resCrNumber', data.crNumber);
        setText('resApplicantName', data.applicantName);
        setText('resCreationDate', data.creationDate);
        setText('resExpiryDate', data.expiryDate);
        setText('resStatus', data.status);
        setText('resAmount', data.amount);

        // Populate Print Layout
        if(document.getElementById('printCompanyEn')) {
            setText('printCompanyEn', data.companyEn || defaultDocData.companyEn);
            setText('printUnifiedEn', data.unifiedNumber);
            setText('printCrEn', data.crNumber);
            
            setText('printCompanyAr', data.companyName);
            setText('printUnifiedAr', data.unifiedNumber);
            setText('printCrAr', data.crNumber);
            
            setText('printDateEn', data.dateEn || defaultDocData.dateEn);
            setText('printRefEn', data.requestNumber);
            
            setText('printDateAr', data.dateHijri || defaultDocData.dateHijri);
            setText('printRefAr', data.requestNumber);
            
            setText('printBodyCompany1', data.companyName);
            setText('printBodyCompany2', data.companyName);
            
            const secondParty = data.secondParty || defaultDocData.secondParty;
            setText('printBodyParty2', secondParty);
            setText('printBodyParty2Sign', secondParty);
            
            setText('printCreatorEn', data.creatorEn || defaultDocData.creatorEn);
            setText('printCreatorAr', data.creatorAr || defaultDocData.creatorAr);
            
            // Just use the first 10 chars of expiryDate for valid till date
            const validDate = data.expiryDate ? data.expiryDate.split(' ')[0] : '10/23/2026';
            setText('printValidEn', validDate.replace(/\//g, '-'));
            setText('printValidAr', validDate.replace(/\//g, '-'));
        }
    }

    // Handle Barcode (URL parameters)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('barcode') || urlParams.has('ref')) {
        if(formContainer) formContainer.classList.remove('active');
        if(step3) step3.classList.add('active');
        
        const data = JSON.parse(localStorage.getItem('docData')) || defaultDocData;
        const qrLink = data.qrLink || "https://eservices.mcci.org.sa/#/DocumentVerify";
        
        // Generate Screen QR Code
        const qrcodeElem = document.getElementById("qrcode");
        if (qrcodeElem) {
            new QRCode(qrcodeElem, {
                text: qrLink, width: 128, height: 128,
                colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H
            });
        }
        
        // Generate Print QR Code
        const printQrcode = document.getElementById("printQrcode");
        if(printQrcode) {
            new QRCode(printQrcode, {
                text: qrLink, width: 90, height: 90,
                colorDark : "#000000", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H
            });
        }
        
        const printQrLinkDisplay = document.getElementById("printQrLinkDisplay");
        if (printQrLinkDisplay) {
            printQrLinkDisplay.textContent = qrLink;
        }

        return;
    }

    // ... (rest of logic: recaptcha, validation, etc)
    if(recaptchaGrid) {
        for(let i=0; i<16; i++) {
            const item = document.createElement('div');
            item.className = 'recaptcha-grid-item';
            item.style.backgroundPosition = `${(i % 4) * 33.333}% ${Math.floor(i / 4) * 33.333}%`;
            item.addEventListener('click', function() {
                this.classList.toggle('selected');
            });
            recaptchaGrid.appendChild(item);
        }
    }

    if(captchaBox) {
        captchaBox.addEventListener('click', () => {
            if (!captchaCheckboxBox.classList.contains('checked')) {
                recaptchaOverlay.classList.add('active');
            }
        });
    }

    if(recaptchaOverlay) {
        recaptchaOverlay.addEventListener('click', (e) => {
            if (e.target === recaptchaOverlay) {
                recaptchaOverlay.classList.remove('active');
            }
        });
    }

    if(btnRecaptchaVerify) {
        btnRecaptchaVerify.addEventListener('click', () => {
            recaptchaOverlay.classList.remove('active');
            captchaCheckboxBox.classList.add('checked');
            btnNext.disabled = false;
        });
    }

    if(btnNext) {
        btnNext.addEventListener('click', () => {
            const data = JSON.parse(localStorage.getItem('docData')) || defaultDocData;
            const refVal = referenceNumberInput.value.trim();
            const expectedRef = data.requestNumber;
            
            if (refVal !== expectedRef) {
                if(refError) {
                    refError.textContent = 'الرقم المرجعي غير صحيح';
                    refError.style.display = 'block';
                    referenceNumberInput.style.borderColor = '#dc3545';
                }
                return;
            }
            
            if(refError) refError.style.display = 'none';
            referenceNumberInput.style.borderColor = '#dcdcdc';
            
            step1Actions.style.display = 'none';
            refNumGroup.style.display = 'none';
            displayRefNumber.textContent = refVal;
            step2Actions.style.display = 'block';
        });
    }

    if(radioInputs) {
        radioInputs.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'unified') {
                    verifyInput.placeholder = 'الرقم الموحد (700)';
                } else {
                    verifyInput.placeholder = 'رقم الهوية';
                }
                verifyError.style.display = 'none';
                verifyInput.style.borderColor = '#dcdcdc';
            });
        });
    }

    if(btnQuery) {
        btnQuery.addEventListener('click', () => {
            const data = JSON.parse(localStorage.getItem('docData')) || defaultDocData;
            const enteredValue = verifyInput.value.trim();
            const selectedMethod = document.querySelector('input[name="verifyMethod"]:checked').value;
            
            let expectedValue = selectedMethod === 'unified' ? data.unifiedNumber : (data.idNumber || '1234567890');

            if (!enteredValue) {
                verifyError.textContent = 'من فضلك أدخل ' + (selectedMethod === 'unified' ? 'الرقم الموحد (700)' : 'رقم الهوية');
                verifyError.style.display = 'block';
                verifyInput.style.borderColor = '#dc3545';
            } else if (enteredValue !== expectedValue) {
                verifyError.textContent = 'الرقم غير صحيح، يرجى التأكد من البيانات المدخلة.';
                verifyError.style.display = 'block';
                verifyInput.style.borderColor = '#dc3545';
            } else {
                verifyError.style.display = 'none';
                verifyInput.style.borderColor = '#dcdcdc';
                const refNo = displayRefNumber.textContent;
                window.location.href = `index.html?barcode=${refNo}`;
            }
        });
    }
    
    if (referenceNumberInput) {
        referenceNumberInput.addEventListener('input', function() {
            this.style.borderColor = '#dcdcdc';
            if(refError) refError.style.display = 'none';
        });
    }
    if (verifyInput) {
        verifyInput.addEventListener('input', function() {
            this.style.borderColor = '#dcdcdc';
            if(verifyError) verifyError.style.display = 'none';
        });
    }
});

// Admin Functions
window.saveAdminData = function() {
    const getVal = (id, fallback = '') => {
        const el = document.getElementById(id);
        return el ? el.value : fallback;
    };

    const data = {
        companyName: getVal('adminCompanyName'),
        chamberName: getVal('adminChamberName'),
        unifiedNumber: getVal('adminUnifiedNumber'),
        idNumber: getVal('adminIdNumber', '1234567890'),
        requestNumber: getVal('adminRequestNumber'),
        requestType: getVal('adminRequestType'),
        crNumber: getVal('adminCrNumber'),
        applicantName: getVal('adminApplicantName'),
        creationDate: getVal('adminCreationDate'),
        expiryDate: getVal('adminExpiryDate'),
        status: getVal('adminStatus'),
        amount: getVal('adminAmount'),
        secondParty: getVal('adminSecondParty'),
        companyEn: getVal('adminCompanyEn'),
        creatorAr: getVal('adminCreatorAr'),
        creatorEn: getVal('adminCreatorEn'),
        dateHijri: getVal('adminDateHijri'),
        dateEn: getVal('adminDateEn'),
        qrLink: getVal('adminQrLink', "https://eservices.mcci.org.sa/#/DocumentVerify")
    };

    try {
        localStorage.setItem('docData', JSON.stringify(data));
        const msg = document.getElementById('saveMessage');
        if(msg) {
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 3000);
        }
    } catch(e) {
        console.error("Error saving to localStorage", e);
        alert("حدث خطأ أثناء الحفظ!");
    }
};

window.resetAdminData = function() {
    localStorage.removeItem('docData');
    window.location.reload();
};
