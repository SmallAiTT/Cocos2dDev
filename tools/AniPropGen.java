package com.tt.game;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class AniPropGen {

	public static void main(String[] args) throws IOException {
		String basePath = "/Users/small/WebstormProjects/Dev/myLdt/";
		String propPath = basePath + "cfg/AniProp.properties";
		String aniPath = basePath + "res/ani";
		AniPropGen gen = new AniPropGen(propPath, aniPath);
		gen.gen();
	}
	
	private List<String> keyList = new ArrayList<String>();
	private Map<String, String> result = new HashMap<String, String>();
	
	private String aniDirPath = "";
	private String propPath;
	private Properties prop;
	
	public AniPropGen(String propPath, String aniDirPath) throws IOException{
		this.propPath = propPath;
		this.aniDirPath = aniDirPath;
		File file = new File(propPath);
		if(!file.exists())
			file.createNewFile();
		this.prop = new Properties();
		InputStream in = new FileInputStream(this.propPath);
		prop.load(in);
	}
	
	public void gen(){
		System.out.println("|---------------------------------------|");
		System.out.println("|        AniPropGen                     |");
		System.out.println("|        Author: Small                  |");
		System.out.println("|        Version: 1.0.0                 |");
		System.out.println("|---------------------------------------|");
		System.out.println("+++++++++++++gen Start+++++++++++++++++");
		keyList.add("DEFAULT");
		result.put("DEFAULT", "0.1");
		parseDir(new File(this.aniDirPath));
		this.writeFile();
		System.out.println("+++++++++++++gen End+++++++++++++++++++");
	};
	
	public void parseDir(File file){
		if(file == null || file.isFile()) return;
		File[] files = file.listFiles();
		for(int i = 0; i < files.length; ++i){
			if(files[i].isDirectory()){
				this.parseDir(files[i]);
			}else if(files[i].isFile()){
				String name = files[i].getName();
				int index = name.lastIndexOf(".plist");
				if(index <= 0) continue;
				String keyName = GameUtils.getKeyName(name);
				keyList.add(keyName);
				String value = this.prop.getProperty(keyName);
				System.out.println(value);
				if(value == null || value.equals("")){
					result.put(keyName, "NEW");
				}else{
					result.put(keyName, value);
				}
			}
		}
	}
	public void writeFile(){
		FileOutputStream out = null;
		try{
            out=new FileOutputStream(this.propPath);
            PrintWriter ps = new PrintWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(this.propPath),"UTF-8")));
    		for(int i = 0; i < this.keyList.size(); ++i){
    			String key = keyList.get(i);
    			String value = result.get(key);
    			StringBuffer sb = new StringBuffer();
    			sb.append(key).append("=").append(value);
    			ps.println(sb);
    		}
    		ps.close();
        } catch (FileNotFoundException e){
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} finally{
    		if(out != null)
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
        }
	}
	

}
