const papers = {

sem1: [
        {name:"ASS 1", file:"https://drive.google.com/file/d/1Tr7L26faghN8nYhQTcfeKU1rvcJSnM-M/view?usp=sharing"},
        {name:"ASS 2", file:"https://drive.google.com/file/d/1dE_oKO4GbkEycKthiKA7wxEoXy9Bz_J7/view?usp=sharing"},
        {name:"ASS 2", file:"https://drive.google.com/file/d/1lsahtL68sA3KJrhsVKuBaenUXxBuEF48/view?usp=sharing"},
        {name:"END SEM", file:"https://drive.google.com/file/d/1FLs0OZ3_IluWfpL5lCeMTvTndNq8eJtA/view?usp=sharing"},
       
        {name:"END SEM", file:"https://drive.google.com/file/d/1PnY1WqunsIsehDLxXuk4VzGHwSGExrbr/view?usp=sharing"}
         {name:"1ST ASSI 2025", file:"https://drive.google.com/file/d/1rWp45RxvCcHcw5dLHQx2waXbErwVkzay/view?usp=sharing"},
        {name:"2NS ASSI 2025", file:"https://drive.google.com/file/d/1pka4gS4yKMc9uENbNTs-mBVSNxMDGjch/view?usp=sharing"},
        {name:"END SEM 2025", file:"https://drive.google.com/file/d/1p7WuezcdLb4VlxTyZ0b3xjnGvvbc0yMk/view?usp=sharing"}  
],

    sem2: [
        {name:"ASS 1", file:"https://drive.google.com/file/d/1KdseMFvtnItnQjU9dIc3_puxPcoMceFg/view?usp=sharing"},
        {name:"ASS 1(math)", file:"https://drive.google.com/file/d/1PzH30poPefRDbldYap7IaCBdc_ZjiObP/view?usp=sharing"},
        {name:"ASS 1(2024)", file:"https://drive.google.com/file/d/1Umyr4tHBbHwxfpqtOaVwc7Cp7l6daiH2/view?usp=sharing"},
        {name:"ASS 2", file:"https://drive.google.com/file/d/1FcpsFjbATFQcGMDL-y9AD9e_4PM9UwTU/view?usp=sharing"},
        {name:"END SEM", file:"https://drive.google.com/file/d/1_pOf156VMsYGtKkKXImTTx5Z935dTg4L/view?usp=sharing"}
    ],

    sem3: [
        {name:"PDF 7", file:"pdf7.pdf"},
        {name:"PDF 8", file:"pdf8.pdf"},
        {name:"PDF 9", file:"pdf9.pdf"}
    ],

    sem4: [
        {name:"PDF 10", file:"pdf10.pdf"},
        {name:"PDF 11", file:"pdf11.pdf"},
        {name:"PDF 12", file:"pdf12.pdf"}
    ],

    sem5: [
        {name:"PDF 13", file:"pdf13.pdf"},
        {name:"PDF 14", file:"pdf14.pdf"},
        {name:"PDF 15", file:"pdf15.pdf"}
    ],

    sem6: [
        {name:"PDF 16", file:"pdf16.pdf"},
        {name:"PDF 17", file:"pdf17.pdf"},
        {name:"PDF 18", file:"pdf18.pdf"}
    ]
};


function showPapers(){

    let sem = document.getElementById("sem").value;
    let paperList = document.getElementById("paperList");

    paperList.innerHTML = "";

    if(!sem) return;

    papers[sem].forEach(paper => {

        paperList.innerHTML += `

        <div class="paper">

            <span>${paper.name}</span>

            <a href="${paper.file}" target="_blank">
                <button>Open PDF</button>
            </a>

            <button onclick="downloadPDF('${paper.file}')">
                Download (+25 Coins)
            </button>

        </div>

        `;

    });

}
